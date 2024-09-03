
import { fabric } from "fabric";
import { ReduxStateType } from "../types/reduxTypes";
import { modelStudio, productStudio } from "../assets/defaultStrings";
import { retrieveFromIndexedDB } from "../utils/DBConfig";
import { backupToDataBaseAPI } from "./APIservice";
import toast from "react-hot-toast";


//------------ add image from sidebar -----------------
export function addImage(url: string, editor: { canvas?: any; }, layer = { layerX: 100, layerY: 100 }): void {
    const image = new Image();
    image.crossOrigin = "Anonymous"; // Ensure cross-origin image data can be accessed

    // Preload the image
    image.onload = function () {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) return

        // Set canvas dimensions to match the image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image onto the canvas
        context.drawImage(image, 0, 0);

        // Get the base64 data URL from the canvas
        const base64URL = canvas.toDataURL('image/png');

        // Create a new Image object with the base64 URL
        const img = new Image();
        img.src = base64URL;

        img.onload = function () {
            const fabricImg = new fabric.Image(img);

            fabricImg.set({
                hasControls: true,
                left: layer.layerX,
                top: layer.layerY,
                objectCaching: false,
                cornerSize: 20,
            });

            // fix the width and height if image size is larger than canvas
            if (fabricImg.width! > editor?.canvas.width) {
                fabricImg.scaleToWidth(editor?.canvas.width / 2);
                fabricImg.scaleToHeight(editor?.canvas.width / 2);
            }
            if (fabricImg.height! > editor?.canvas.height) {
                fabricImg.scaleToWidth(editor?.canvas.height / 2);
                fabricImg.scaleToHeight(editor?.canvas.height / 2);
            }

            editor?.canvas.add(fabricImg);
            // set the object to be centered to the Canvas
            editor?.canvas.centerObject(fabricImg);
            // Ensure the image is brought to the front
            fabricImg.bringToFront();
        };
    };

    // Set the image source
    image.src = url;
}



//--------------- Upload & Add Background ---------------------
export function uploadBackgroundImage(editor: { canvas?: any; }) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.addEventListener('change', (e: any) => {
        const file = e?.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageDataURL = e.target?.result?.toString();
                if (!imageDataURL) return

                const img = new Image();
                img.src = imageDataURL;
                img.onload = function () {
                    const maxRes = 3000;
                    if (img.width > maxRes || img.height > maxRes) {
                        toast.error("Upload a smaller image. Maximum resolution is 3000x3000.");
                    } else {
                        addBackground(imageDataURL, editor);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    });
    inputElement.click();
}


export function addBackground(url: string, editor: { canvas?: any; }): void {
    const image = new Image();
    image.crossOrigin = "Anonymous"; // Ensure cross-origin image data can be accessed
    image.src = url;

    image.onload = function () {
        const img = new fabric.Image(image, {
            selectable: true, // Allow the background image to be selectable
            evented: true, // Allow the background image to trigger events
            originX: 'left', // Position the image from the left edge
            originY: 'top', // Position the image from the top edge
        });

        // Scale the background image to fit the canvas size
        img.scaleToWidth(editor?.canvas.width);
        img.scaleToHeight(editor?.canvas.height);

        // Add the background image to the canvas
        editor?.canvas.add(img);

        // Ensure the background image is behind every other object
        img.sendToBack();
    }
}

//------------- upload image to canvas ------------------------
function handleFileUpload(e: any, editor: { canvas?: any; }) {
    const file = e?.target?.files?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target?.result?.toString()!;
            image.onload = function () {

                //resolution limit check
                const maxRes = 3000;
                if (image.width > maxRes || image.height > maxRes) {
                    return toast.error("Upload a smaller image. Maximum resolution is 3000x3000.");
                }

                const img = new fabric.Image(image);

                img.set({
                    hasControls: true,
                    left: 5,
                    top: 5,
                    objectCaching: false,
                    cornerSize: 20,
                });

                if (img.width! > editor?.canvas.width) {
                    img.scaleToWidth(editor?.canvas.width / 2);
                    img.scaleToHeight(editor?.canvas.width / 2);
                }
                if (img.height! > editor?.canvas.height) {
                    img.scaleToWidth(editor?.canvas.height / 2);
                    img.scaleToHeight(editor?.canvas.height / 2);
                }
                editor?.canvas.add(img);
                // set the object to be centered to the Canvas
                editor?.canvas.centerObject(img);
                editor?.canvas.setActiveObject(img);
            };
        };
        reader.readAsDataURL(file);
    }
}

//-------------- initiate image upload feature --------------

export function uploadImage(editor: { canvas?: any; }) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.addEventListener('change', (e) => handleFileUpload(e, editor));
    inputElement.click();
}

export function uploadVisuals(editor: { canvas?: any; }) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/png, image/svg+xml';
    inputElement.addEventListener('change', (e) => handleFileUpload(e, editor));
    inputElement.click();
}


//-------------- initiate image drag and drop feature --------------
export const handleDragStart = (event: { target: any; dataTransfer: { setData: (arg0: string, arg1: any) => void; }; }) => {
    const target = event.target;
    const imageUrl = target.src;
    event.dataTransfer.setData('text/plain', imageUrl);
};



//------------ Image to base 64 format -----------------
export function imgToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous"; // Ensure cross-origin image data can be accessed

        // Preload the image
        image.onload = function () {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
                reject(new Error('Canvas context is not supported'));
                return;
            }

            // Set canvas dimensions to match the image
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw the image onto the canvas
            context.drawImage(image, 0, 0);

            // Get the base64 data URL from the canvas
            const base64URL = canvas.toDataURL('image/png');

            resolve(base64URL);
        };

        // Handle image loading errors
        image.onerror = function () {
            reject(new Error('Failed to load the image'));
        };

        // Set the image source
        image.src = url;
    });
}


//------------ BackUp Data on Logout to MongoDB -----------------
export async function backupToDataBase(reduxData: ReduxStateType) {
    try {
        const formData = JSON.parse(localStorage.getItem("productGenerateFormData"));
        const modelGeneratePrompt = localStorage.getItem("modelGeneratePrompt") || "";
        const productCanvasData = await retrieveFromIndexedDB(productStudio);
        const modelCanvasData = await retrieveFromIndexedDB(modelStudio);
        return new Promise(async (resolve, reject) => {

            const dataToSave = {
                userId: reduxData?.user?.userData?._id,                         // ObjectId of the user
                history: [
                    {
                        generate_product_details: [
                            {
                                product: formData?.product || "",               // string
                                placement: formData?.placement || "",           // string
                                surrounding: formData?.surrounding || "",       // string
                                background: formData?.background || "",         // string
                                prompt: formData?.prompt || "",                 // string
                                images: reduxData?.canvas?.generatedImageList,  // array
                            }
                        ],
                        generate_model_details: [
                            {
                                prompt: modelGeneratePrompt || "",              // string
                                images: reduxData?.canvas?.generatedModelsList, // array
                            }
                        ],
                        upscaler: reduxData?.canvas?.upscaledImage,             // string || null
                        outpaint: reduxData?.canvas?.outpaintedImage,           // string || null
                        background_remover: reduxData?.canvas?.bgRemovedImage,  // string || null
                        magic_remove: reduxData?.canvas?.magicRemovedImage,     // string || null
                        magic_replace: reduxData?.canvas?.magicReplacedImage,    // string || null
                        product_canvas: productCanvasData,                      // string || null
                        model_canvas: modelCanvasData,                          // string || null
                    }
                ]
            }

            const isBackUp = await backupToDataBaseAPI(dataToSave)
            if (isBackUp) resolve(true);
            else reject(false);
        });
    } catch (error) {
        console.log(error)
    }
}

