import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeTool: "1",
    activeToolName: "Ad Layout",
    aspect_ratio: "1:1",
    selectedStudio: "",
    editor: null,
    isLoadingState: "idle", // idle, loading, loaded
    uploadedImage: null,
    generatedImage: null,
    maskImage: null,
    backgroundImage: null,
    upscaledImage: null,
    outpaintedImage: null,
    magicRemovedImage: null,
    magicReplacedImage: null,
    canvasScaleFactor: 1,
    bgRemovedImage: null,
    generatedImageList: null,
    generatedModelsList: null,
    isModelGenerate: false,
    isBrushMaskApplied: false,
    modelGeneratePrompt: null,
    modelFace: null,
    modelPose: null,
    isBrushToolMode: null,
    brushSize: "75",
    adCreativeImport: null,
    adCreativeExport: null,
}

const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        setTool: (state, action) => {
            // console.log(action.payload) //test
            state.activeTool = action.payload;
            // Save in local storage
            localStorage.setItem('tool', action.payload.token);
        },

        setToolName: (state, action) => {
            state.activeToolName = action.payload;
        },

        setRatio: (state, action) => {
            state.aspect_ratio = action.payload;
            localStorage.setItem('aspect_ratio', action.payload.token); // Save in local storage
        },

        setSelectedStudio: (state, action) => {
            state.selectedStudio = action.payload;
        },

        setEditor: (state, action) => {
            state.editor = action.payload;
        },

        setLoading: (state, action) => {
            state.isLoadingState = action.payload;
        },

        setUploadImageSrc: (state, action) => {
            state.uploadedImage = action.payload;
        },

        setGeneratedImageSrc: (state, action) => {
            state.generatedImage = action.payload;
        },

        setMaskImage: (state, action) => {
            state.maskImage = action.payload;
        },

        setBackgroundImage: (state, action) => {
            state.backgroundImage = action.payload;
        },

        setUpscaledImage: (state, action) => {
            state.upscaledImage = action.payload;
        },

        setOutpaintedImage: (state, action) => {
            state.outpaintedImage = action.payload;
        },

        setMagicRemovedImage: (state, action) => {
            state.magicRemovedImage = action.payload;
        },

        setMagicReplacedImage: (state, action) => {
            state.magicReplacedImage = action.payload;
        },

        setCanvasScaleFactor: (state, action) => {
            state.canvasScaleFactor = action.payload;
        },

        setBgRemovedImage: (state, action) => {
            state.bgRemovedImage = action.payload;
        },

        setGeneratedImagesList: (state, action) => {
            state.generatedImageList = action.payload;
        },

        setGeneratedModelsList: (state, action) => {
            state.generatedModelsList = action.payload;
        },

        setModelGenerate: (state, action) => {
            state.isModelGenerate = action.payload;
        },

        setIsBrushMaskApplied: (state, action) => {
            state.isBrushMaskApplied = action.payload;
        },

        setModelGeneratePrompt: (state, action) => {
            state.modelGeneratePrompt = action.payload;
        },

        setModelFace: (state, action) => {
            state.modelFace = action.payload;
        },

        setModelPose: (state, action) => {
            state.modelPose = action.payload;
        },

        setBrushToolMode: (state, action) => {
            state.isBrushToolMode = action.payload;
        },

        setBrushSize: (state, action) => {
            state.brushSize = action.payload;
        },

        setAdCreativeImport: (state, action) => {
            state.adCreativeImport = action.payload;
        },

        setAdCreativeExport: (state, action) => {
            state.adCreativeExport = action.payload;
        },

        reset: (state) => {
            state.activeTool = "1";
            state.aspect_ratio = "1:1";
            // localStorage.clear(); // Clear all data in local storage & redux state
        },
    }
})
export default canvasSlice.reducer

export const {
    setTool,
    setToolName,
    setRatio,
    setSelectedStudio,
    setEditor,
    setUploadImageSrc,
    setGeneratedImageSrc,
    setMaskImage,
    setBackgroundImage,
    setUpscaledImage,
    setOutpaintedImage,
    setMagicRemovedImage,
    setMagicReplacedImage,
    setCanvasScaleFactor,
    setBgRemovedImage,
    setGeneratedImagesList,
    setGeneratedModelsList,
    setLoading,
    setModelGenerate,
    setIsBrushMaskApplied,
    setModelGeneratePrompt,
    setModelFace,
    setModelPose,
    setBrushToolMode,
    setBrushSize,
    setAdCreativeImport,
    setAdCreativeExport,
    reset } = canvasSlice.actions