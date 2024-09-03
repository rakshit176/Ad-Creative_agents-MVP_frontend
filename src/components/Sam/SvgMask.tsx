
import React, { useContext, useEffect, useState, useRef } from "react";
import AppContext from "./hooks/createContext";
import { useDispatch } from "react-redux";
import { setMaskImage } from "../../features/canvas/canvasSlice";

interface SvgMaskProps {
  xScale: number;
  yScale: number;
  svgStr: string;
  id?: string | undefined;
  className?: string | undefined;
}

const SvgMask = ({  xScale, yScale, svgStr, id = "", className = "", }: SvgMaskProps) => {
  const {
    click: [click, setClick],
    image: [image],
    isLoading: [isLoading, setIsLoading],
    canvasWidth: [, setCanvasWidth],
    canvasHeight: [, setCanvasHeight],
    isErasing: [isErasing, setIsErasing],
    svg: [svg],
    isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
  } = useContext(AppContext)!;
  const [key, setKey] = useState(Math.random());
  const [boundingBox, setBoundingBox] = useState<DOMRect | undefined>( undefined);
  const pathRef = useRef<SVGPathElement>(null);
  const dispatch = useDispatch()
  const getBoundingBox = () => {
    if (!pathRef?.current) return;
    setBoundingBox(pathRef.current.getBBox());
  };
  useEffect(() => {
    if (!isLoading) {
      setKey(Math.random());
    }
    getBoundingBox();
  }, [svg]);
  const bbX = boundingBox?.x;
  const bbY = boundingBox?.y;
  const bbWidth = boundingBox?.width;
  const bbHeight = boundingBox?.height;
  const bbMiddleY = bbY && bbHeight && bbY + bbHeight / 2;
  const bbWidthRatio = bbWidth && bbWidth / xScale;

  // Get the SVG element
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.setAttribute("viewBox", `0 0 ${xScale || 0} ${yScale || 0}`);

  // Append the content inside the SVG element
  svgElement.innerHTML = `
    <radialGradient
      id="gradient${id}"
      cx="0"
      cy="0"
      r="${bbWidth || 0}"
      gradientUnits="userSpaceOnUse"
      gradientTransform="translate(${(bbX || 0) - ((bbWidth || 0) / 4)},${bbMiddleY || 0})"
    >
      <stop offset="0" stop-color="white" stop-opacity="0"></stop>
      <stop offset="0.25" stop-color="white" stop-opacity="0.7"></stop>
      <stop offset="0.5" stop-color="white" stop-opacity="0"></stop>
      <stop offset="0.75" stop-color="white" stop-opacity="0.7"></stop>
      <stop offset="1" stop-color="white" stop-opacity="0"></stop>
      <animateTransform
        attributeName="gradientTransform"
        attributeType="XML"
        type="scale"
        from="0"
        to="12"
        dur="1.5s"
        begin=".3s"
        fill="freeze"
        additive="sum"
      ></animateTransform>
    </radialGradient>
    <clipPath id="clip-path${id}">
      <path d="${svgStr || ''}" />
    </clipPath>
    <filter id="glow${id}" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FF474C" />
      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF474C" />
      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FF474C" />
    </filter>
    <image
      width="100%"
      height="100%"
      xlink:href="${image?.src || ''}"
      clip-path="url(#clip-path${id})"
    />
    ${
      !click && (!isLoading || isErasing)
        ? `
        <path
          id="mask-gradient${id}"
          class="mask-gradient ${
            (bbWidthRatio || 0) > 0.5 && window.innerWidth < 768 ? "hidden" : ""
          }"
          d="${svgStr || ''}"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-opacity="0"
          fill-opacity="1"
          fill="url(#gradient${id})"
        />
        <path
          id="mask-path${id}"
          class="mask-path"
          d="${svgStr || ''}"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-opacity=".8"
          fill-opacity="0"
          stroke="#FF474C"
          stroke-width="3"
          filter="url(#glow${id})"
        />
        `
        : ''
    }
  `;

  // Create a new canvas element
  const canvas = document.createElement('canvas');
  canvas.width = xScale || 0;
  canvas.height = yScale || 0;

  // Get the canvas context
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Create an image element
    const img = new Image();
    img.onload = function() {
      // Draw the SVG onto the canvas
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      const pixels = imageData.data;
  
      // Loop through each pixel
      for (let i = 0; i < pixels.length; i += 4) {
        const alpha = pixels[i + 3];
        // If pixel is fully transparent (alpha = 0)
        if (alpha === 0) {
          // Make the pixel black
          pixels[i] = 0; // Red
          pixels[i + 1] = 0; // Green
          pixels[i + 2] = 0; // Blue
          pixels[i + 3] = 255; // Set alpha to opaque
        } else {
          // Make the pixel white
          pixels[i] = 255; // Red
          pixels[i + 1] = 255; // Green
          pixels[i + 2] = 255; // Blue
          pixels[i + 3] = 255; // Set alpha to opaque
        }
      }
  
      // Put the modified image data back to the canvas
      ctx.putImageData(imageData, 0, 0);
  
      const dataURL = ctx.canvas.toDataURL('image/png');
      
      // Now you can use the dataURL as the source for an image tag or save it as an image
      dispatch(setMaskImage(dataURL));
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgElement));
  } else {
    console.error('Canvas context is null');
  }
    
  return (
    <svg
      className={`absolute w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${xScale} ${yScale}`}
      key={key}
    >
      {!isMultiMaskMode && bbX && bbWidth && (
        <>
          <radialGradient
            id={"gradient" + id}
            cx={0}
            cy={0}
            r={bbWidth}
            gradientUnits="userSpaceOnUse"
            gradientTransform={`translate(${bbX - bbWidth / 4},${bbMiddleY})`}
          >
            <stop offset={0} stopColor="white" stopOpacity="0"></stop>
            <stop offset={0.25} stopColor="white" stopOpacity={0.7}></stop>
            <stop offset={0.5} stopColor="white" stopOpacity="0"></stop>
            <stop offset={0.75} stopColor="white" stopOpacity={0.7}></stop>
            <stop offset={1} stopColor="white" stopOpacity="0"></stop>
            <animateTransform
              attributeName="gradientTransform"
              attributeType="XML"
              type="scale"
              from={0}
              to={12}
              dur={`1.5s`}
              begin={".3s"}
              fill={"freeze"}
              additive="sum"
            ></animateTransform>
          </radialGradient>
        </>
      )}
      <clipPath id={"clip-path" + id}>
        <path d={svgStr} />
      </clipPath>
      <filter id={"glow" + id} x="-50%" y="-50%" width={"200%"} height={"200%"}>
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FF474C" />
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF474C" />
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FF474C" />
      </filter>
      <image
        width="100%"
        height="100%"
        xlinkHref={image?.src}
        clipPath={`url(#clip-path${id})`}
      />
      {!click && (!isLoading || isErasing) && (
        <>
          {!isMultiMaskMode && bbWidthRatio && (
            <path
              id={"mask-gradient" + id}
              className={`mask-gradient ${
                bbWidthRatio > 0.5 && window.innerWidth < 768 ? "hidden" : ""
              }`}
              d={svgStr}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0"
              fillOpacity="1"
              fill={`url(#gradient${id})`}
            />
          )}
          <path
            id={"mask-path" + id}
            className="mask-path"
            d={svgStr}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity=".8"
            fillOpacity="0"
            stroke="#FF474C"
            strokeWidth="3"
            ref={pathRef}
            filter={`url(#glow${id})`}
          />
        </>
      )}
    </svg>
  );
};

export default SvgMask;





// import React, { useContext, useEffect, useState, useRef } from "react";
// import AppContext from "./hooks/createContext";

// interface SvgMaskProps {
//   xScale: number;
//   yScale: number;
//   svgStr: string;
//   id?: string | undefined;
//   className?: string | undefined;
// }

// const SvgMask = ({
//   xScale,
//   yScale,
//   svgStr,
//   id = "",
//   className = "",
// }: SvgMaskProps) => {
//   const {
//     click: [click, setClick],
//     image: [image],
//     isLoading: [isLoading, setIsLoading],
//     canvasWidth: [, setCanvasWidth],
//     canvasHeight: [, setCanvasHeight],
//     isErasing: [isErasing, setIsErasing],
//     svg: [svg],
//     isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
//   } = useContext(AppContext)!;
//   const [key, setKey] = useState(Math.random());
//   const [boundingBox, setBoundingBox] = useState<DOMRect | undefined>(
//     undefined
//   );
//   const pathRef = useRef<SVGPathElement>(null);
//   const getBoundingBox = () => {
//     if (!pathRef?.current) return;
//     setBoundingBox(pathRef.current.getBBox());
//   };
//   useEffect(() => {
//     if (!isLoading) {
//       setKey(Math.random());
//     }
//     getBoundingBox();
//   }, [svg]);
//   const bbX = boundingBox?.x;
//   const bbY = boundingBox?.y;
//   const bbWidth = boundingBox?.width;
//   const bbHeight = boundingBox?.height;
//   const bbMiddleY = bbY && bbHeight && bbY + bbHeight / 2;
//   const bbWidthRatio = bbWidth && bbWidth / xScale;
//   return (
//     <svg
//       className={`absolute w-full h-full pointer-events-none ${className}`}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox={`0 0 ${xScale} ${yScale}`}
//       key={key}
//     >
//       {!isMultiMaskMode && bbX && bbWidth && (
//         <>
//           <radialGradient
//             id={"gradient" + id}
//             cx={0}
//             cy={0}
//             r={bbWidth}
//             gradientUnits="userSpaceOnUse"
//             gradientTransform={`translate(${bbX - bbWidth / 4},${bbMiddleY})`}
//           >
//             <stop offset={0} stopColor="white" stopOpacity="0"></stop>
//             <stop offset={0.25} stopColor="white" stopOpacity={0.7}></stop>
//             <stop offset={0.5} stopColor="white" stopOpacity="0"></stop>
//             <stop offset={0.75} stopColor="white" stopOpacity={0.7}></stop>
//             <stop offset={1} stopColor="white" stopOpacity="0"></stop>
//             <animateTransform
//               attributeName="gradientTransform"
//               attributeType="XML"
//               type="scale"
//               from={0}
//               to={12}
//               dur={`1.5s`}
//               begin={".3s"}
//               fill={"freeze"}
//               additive="sum"
//             ></animateTransform>
//           </radialGradient>
//         </>
//       )}
//       <clipPath id={"clip-path" + id}>
//         <path d={svgStr} />
//       </clipPath>
//       <filter id={"glow" + id} x="-50%" y="-50%" width={"200%"} height={"200%"}>
//         <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#5856d6" />
//         <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#5856d6" />
//         <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#5856d6" />
//       </filter>
//       <image
//         width="100%"
//         height="100%"
//         xlinkHref={image?.src}
//         clipPath={`url(#clip-path${id})`}
//       />
//       {!click && (!isLoading || isErasing) && (
//         <>
//           {!isMultiMaskMode && bbWidthRatio && (
//             <path
//               id={"mask-gradient" + id}
//               className={`mask-gradient ${
//                 bbWidthRatio > 0.5 && window.innerWidth < 768 ? "hidden" : ""
//               }`}
//               d={svgStr}
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeOpacity="0"
//               fillOpacity="1"
//               fill={`url(#gradient${id})`}
//             />
//           )}
//           <path
//             id={"mask-path" + id}
//             className="mask-path"
//             d={svgStr}
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeOpacity=".8"
//             fillOpacity="0"
//             stroke="#5856d6"
//             strokeWidth="3"
//             ref={pathRef}
//             filter={`url(#glow${id})`}
//           />
//         </>
//       )}
//     </svg>
//   );
// };

// export default SvgMask;
