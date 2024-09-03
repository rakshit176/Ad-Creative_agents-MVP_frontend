import { fabric } from 'fabric';
// Define a type for the Fabric.js canvas
type FabricCanvas = fabric.Canvas;

export default interface canvasTypeRedux {
    activeTool: string,
    activeToolName: string,
    aspect_ratio: string,
    selectedStudio: string,
    editor: { canvas: FabricCanvas },
    isLoadingState: string,
    uploadedImage: null | string,
    generatedImage: null | string,
    maskImage: null | string,
    backgroundImage: null | string,
    upscaledImage: null | string,
    outpaintedImage: null | string,
    magicRemovedImage: null | string,
    magicReplacedImage: null | string,
    canvasScaleFactor:number,
    bgRemovedImage: null | string,
    generatedImageList: null | string[],
    generatedModelsList: null | string[],
    isModelGenerate: boolean,
    isBrushMaskApplied: boolean,
    modelGeneratePrompt: null | string,
    modelFace: null | string,
    modelPose: null | string,
    isBrushToolMode: boolean,
    brushSize: string,
    adCreativeImport: null | string,
    adCreativeExport: null | string,
}
