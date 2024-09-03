// @ts-nocheck
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { ReduxStateType } from "../../types/reduxTypes";
import { useDispatch, useSelector } from "react-redux";
import { setCanvasScaleFactor, setEditor } from "../../features/canvas/canvasSlice";
import { addBackground, addImage } from "../../services/canvasMethods";

function OutpaintCanvas() {
  const { selectedObjects, editor, onReady } = useFabricJSEditor();
  const { aspect_ratio, outpaintedImage } = useSelector((state: ReduxStateType) => state.canvas);
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const CanvasContainerRef = useRef(null);


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

  // -------------add new outpainted result image-------------------
  useEffect(() => {
    if (outpaintedImage && editor) {
      // Clear all objects from the canvas
      editor.canvas.clear();
      //Add the outpainted image as background to fit entire canvas
      addBackground(outpaintedImage, editor)
    }
  }, [outpaintedImage]);

  // --------------------------------------------------

  return (
    <div className={`container-fluid w-[78vw] bg-canvasBg`}>
      <div className="">
        <div className="h-[95vh] flex justify-evenly items-center" ref={CanvasContainerRef}>
          <div className="outpaint-canvas-container" ref={canvasRef}>
            <FabricJSCanvas className={`bg-white border rounded-xl shadow-md border-gray-300 m-5`}
              onReady={onReady} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutpaintCanvas;
