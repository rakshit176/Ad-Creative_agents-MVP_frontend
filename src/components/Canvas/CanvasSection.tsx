// @ts-nocheck

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { ReduxStateType } from "../../types/reduxTypes";
import { useDispatch, useSelector } from "react-redux";
import { setAdCreativeImport, setBackgroundImage, setCanvasScaleFactor, setEditor, setMaskImage, setUploadImageSrc } from "../../features/canvas/canvasSlice";
import { addImage } from "../../services/canvasMethods";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { retrieveFromIndexedDB, saveToIndexedDB } from "../../utils/DBConfig";

function CanvasSection() {
  const { selectedObjects, editor, onReady } = useFabricJSEditor();
  const { aspect_ratio, activeTool, isModelGenerate, generatedModelsList, activeToolName, selectedStudio } = useSelector((state: ReduxStateType) => state.canvas);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const canvasRef = useRef(null);
  const CanvasContainerRef = useRef(null);
  const [tool, setTool] = useState("1");

  useEffect(() => {
    setTool(activeTool);
  }, [activeTool])



  //------------- Change AspectRatio ----------------------
  useEffect(() => {
    const dimensionsString = aspect_ratio;
    const dimensionsArray = dimensionsString.split(":");
    const width = parseInt(dimensionsArray[0]);
    const height = parseInt(dimensionsArray[1]);

    let canvasWidth: number, canvasHeight: number;

    if (width && height) {
      const containerWidth = CanvasContainerRef.current.offsetWidth;
      const containerHeight = CanvasContainerRef.current.offsetHeight;

      const widthScale = containerWidth / width;
      const heightScale = containerHeight / height;

      const scaleFactor = Math.min(widthScale, heightScale);
      dispatch(setCanvasScaleFactor(scaleFactor));

      if (widthScale < heightScale) {
        // Fit to width
        canvasWidth = containerWidth;
        canvasHeight = height * widthScale;
      } else {
        // Fit to height
        canvasWidth = width * heightScale;
        canvasHeight = containerHeight;
      }

      editor?.canvas.setWidth(canvasWidth);
      editor?.canvas.setHeight(canvasHeight);

    }
    dispatch(setEditor(editor));
  }, [editor, aspect_ratio]);

  //------------- handle key press --------------------------
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (selectedObjects) {
        if (event.key === "Delete" || event.key === "Backspace") {
          editor?.deleteSelected();
        } else if (event.shiftKey && event.key === "ArrowUp") {
          // Zoom in logic here
          editor?.zoomIn()
        } else if (event.shiftKey && event.key === "ArrowDown") {
          // Zoom out logic here
          editor?.zoomOut()
        }
        else if (event.key === "Enter" || event.key === "Escape") {
          //deselect code
          if (!editor) return
          editor?.canvas?.discardActiveObject();
          editor?.canvas?.requestRenderAll();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedObjects, editor]);

  //------------- setting canvas styles ----------------------
  useEffect(() => {
    if (editor) {
      fabric.Object.prototype.cornerColor = "white";
      fabric.Object.prototype.cornerStyle = "circle";
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerStrokeColor = "#98A2B3";
      fabric.Object.prototype.borderColor = "#3292BB";
      fabric.Canvas.prototype.preserveObjectStacking = true;
      editor.canvas.requestRenderAll()
    }
  }, [editor]);


  //----------------handle drag and drop images---------------
  useEffect(() => {
    function handleDrop(event: any) {
      const imageUrl = event.dataTransfer.getData('text/plain');
      const layerX: number = event.layerX; //location of drop pointers
      const layerY: number = event.layerY;
      if (editor) addImage(imageUrl, editor, { layerX, layerY })
    }

    // Prevent default behavior for drag-and-drop events
    const preventDefault = (event: { preventDefault: () => void; stopPropagation: () => void; }) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // Add event listeners for drag-and-drop
    const canvasElement: Element = canvasRef.current!

    if (!canvasElement) return
    canvasElement.addEventListener('dragover', preventDefault, false);
    canvasElement.addEventListener('dragenter', preventDefault, false);
    canvasElement.addEventListener('drop', handleDrop, false);

    // Cleanup: Remove event listeners
    return () => {
      canvasElement.removeEventListener('dragover', preventDefault);
      canvasElement.removeEventListener('dragenter', preventDefault);
      canvasElement.removeEventListener('drop', handleDrop);
    };
  })

  // ============= Saving & Fetching temporarily to /from local Storage ===============

  useEffect(() => {
    if (window?.location?.search?.includes("Fill")) {
      editor?.canvas.clear(); // Remove all objects from the canvas
      editor?.canvas.requestRenderAll(); // Render the canvas after clearing
    } else {

      //get data from IndexedBD
      retrieveFromIndexedDB(selectedStudio)
        .then(data => {
          if (data && editor?.canvas) {
            // Use the retrieved data as needed
            editor?.canvas.loadFromJSON(data, () => {
              editor?.canvas.requestRenderAll();
            });
          }
        })
        .catch(error => {
          console.error('Error retrieving data from IndexedDB:', error);
        });

      //----- Save Masked Image to redux---------
      const objects = editor?.canvas?.getObjects();
      if (objects && objects.length > 0) {
        const objectToHide = objects[0];
        objectToHide.visible = false;
        editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes

        const dataUrl = editor?.canvas.toDataURL();
        dispatch(setMaskImage(dataUrl));
        // console.log(dataUrl) //test

        objectToHide.visible = true;

        editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes

        //-----------Save Background Image to Redux ----------

        for (let i = 1; i < objects.length; i++) {
          const objectToHide = objects[i];
          objectToHide.visible = false;
        }

        editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes

        const BgDataUrl = editor?.canvas.toDataURL();
        dispatch(setBackgroundImage(BgDataUrl));
        // console.log(BgDataUrl) //test

        const objectToShow = objects[0];
        objectToShow.visible = true;

        editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes
      }
      //------------------------------------------
    }

    return () => {
      if (editor?.canvas && activeToolName !== "Ad Layout") {
        const jsonData = JSON.stringify(editor?.canvas.toJSON()); // Export canvas as JSON
        // localStorage.setItem('canvasData', jsonData); // Save JSON data to local storage 
        saveToIndexedDB(jsonData, selectedStudio) // Save JSON data to IndexedDB
          .catch(error => {
            console.error('Error saving data to IndexedDB:', error); //test
          });

        //set canvas as image in redux
        const dataUrl = editor?.canvas.toDataURL();
        dispatch(setUploadImageSrc(dataUrl));

        //----- Save Masked Image to redux---------
        const objects = editor?.canvas?.getObjects();
        if (objects && objects.length > 0) {
          const objectToHide = objects[0];
          objectToHide.visible = false;
          editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes

          const dataUrl = editor?.canvas.toDataURL();
          dispatch(setMaskImage(dataUrl));
          // console.log(dataUrl) //test

          objectToHide.visible = true;

          editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes

          //-----------Save Background Image to Redux ----------

          for (let i = 1; i < objects.length; i++) {
            const objectToHide = objects[i];
            objectToHide.visible = false;
          }

          editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes

          const BgDataUrl = editor?.canvas.toDataURL();
          dispatch(setBackgroundImage(BgDataUrl));
          // console.log(BgDataUrl) //test

          const objectToShow = objects[0];
          objectToShow.visible = true;

          editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes
        }
        //------------------------------------------
      }
    };
  }, [tool]);


  //--------- Saving Canvas as Image -------------

  useEffect(() => {
    return () => {
      if (editor?.canvas) {
        const dataUrl = editor?.canvas.toDataURL({});
        dispatch(setUploadImageSrc(dataUrl));
      }
    }
  }, [])

  // ---------- Layers ------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [layerObjects, setLayerObjects] = useState<Object[] | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const layers = editor?.canvas?.getObjects();
      if (layers) setLayerObjects(layers);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [editor]);

  useEffect(() => {
    if (editor?.canvas) {
      const jsonData = JSON.stringify(editor?.canvas.toJSON()); // Export canvas as JSON
      saveToIndexedDB(jsonData, selectedStudio) // Save JSON data to IndexedDB
        .catch(error => {
          console.error('Error saving data to IndexedDB:', error); //test
        });
    }
  }, [editor?.canvas?.getObjects()?.length])


  useEffect(() => {
    const layers = editor?.canvas?.getObjects();
    if (layers) setLayerObjects(layers);
  }, [isModalOpen, editor?.canvas?._objects.length]);

  function openLayerModal() {
    setIsModalOpen(true);
    if (!layerObjects) {
      setIsModalOpen(false);
      toast.error("No layers found")
    }
  }

  // --------------------------------------------------

  return (
    <div className={`container-fluid 
   ${isModelGenerate ? "w-[58vw]" : "w-[78vw]"}
     bg-canvasBg overflow-y-auto overflow-x-auto`}>


      {/* //test */}
      {(layerObjects?.length && layerObjects?.length > 1) ? (
        <div className="absolute top-20 ms-10 z-50">
          <button className="bg-white px-5 py-1.5 rounded-lg border cursor-pointer shadow-sm"
            onClick={() => { isModalOpen ? setIsModalOpen(false) : openLayerModal() }}>
            Layers
          </button>

          {(isModalOpen && layerObjects?.length) ? (
            <div className="bg-white border px-4 py-2.5 text-start rounded-lg shadow-lg w-[340px] max-h-[80vh] overflow-y-auto absolute top-10 right-0">
              {/* Layers view */}
              {layerObjects.map((object: any, index) => (
                <div key={index} className="flex items-center py-2 px-3 border-b border-gray-200 last:border-b-0 rounded">
                  <input
                    type="checkbox"
                    className="mr-2 accent-violetBg"
                    checked={object.visible} // Assuming there's a property to track visibility
                    onChange={(e) => {
                      const objects = editor?.canvas?.getObjects();
                      objects[index].visible = e.target.checked;
                      editor?.canvas?.requestRenderAll();
                    }} // Handle visibility change
                  />

                  <div className="w-12 h-12 image-container me-3">
                    <img src={object?._element?.currentSrc} alt={`Layer Preview ${index}`} className="rounded border" />
                  </div>

                  <div className="w-[130px] text-start">
                    <h5 className="text-sm">{index === 0 ? "Background" : `Layer_${index}`}</h5>
                  </div>

                  <button
                    className={`ml-2 bg-transparent border rounded text-sm text-gray-500 hover:text-gray-700 
                    ${index === 0 ? "opacity-35 cursor-default" : "cursor-pointer"}`}
                    onClick={() => {
                      const objects = editor?.canvas?.getObjects();
                      const selectedObject = objects[index];
                      editor?.canvas?.sendBackwards(selectedObject);
                    }}>
                    <span className="material-symbols-outlined">  arrow_drop_up </span>
                  </button>

                  <button
                    className={`ml-2 bg-transparent border rounded text-sm text-gray-500 hover:text-gray-700
                    ${index === (editor?.canvas?.getObjects()?.length - 1) ? "opacity-35 cursor-default" : "cursor-pointer"}`}
                    onClick={() => {
                      const objects = editor?.canvas?.getObjects();
                      const selectedObject = objects[index];
                      editor?.canvas?.bringForward(selectedObject);
                    }}>
                    <span className="material-symbols-outlined"> arrow_drop_down </span>
                  </button>

                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="h-[94vh]">
        <div className="h-full flex justify-evenly items-center" ref={CanvasContainerRef}>
          <div ref={canvasRef}>

            {/* Move to ad creative button  */}
            {(activeToolName === "Generate" && generatedModelsList?.length) &&
              <div className="w-full flex justify-end px-5">
                <button className="relative bg-violetBg px-5 py-2.5 font-bold text-white rounded-xl border cursor-pointer"
                  onClick={async () => {
                    const dataUrl = await editor?.canvas.toDataURL({ format: "png", quality: 1 });
                    dispatch(setAdCreativeImport(dataUrl));
                    Navigate('/adCreative');
                  }}>
                  Move to Ad creative
                </button>
              </div>
            }

            <FabricJSCanvas className={`bg-white border rounded-xl shadow-md border-gray-300 mx-0 my-0`}
              onReady={onReady} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default CanvasSection;
