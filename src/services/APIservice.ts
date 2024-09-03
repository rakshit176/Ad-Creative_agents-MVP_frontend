
import axios from "axios"
import { API_END_POINT, ML_API, ModelStudioEndPoints, authEndPoint, backupEndPoint, productModelEndPoints } from "../utils/links";


// ============ Search Images with Unsplash ================

export const getImagesbyUnsplash = async (searchQuery: string) => {
    const unsplashAPI = `https://api.polotno.com/api/get-unsplash?query=${searchQuery}&per_page=30&page=1&KEY=nFA5H9elEytDyPyvKL7T`;

    try {
        const response = await fetch(unsplashAPI);
        if (!response.ok) throw new Error('Failed to fetch images from Unsplash');
        const data = await response.json();
        return data.results;

    } catch (error) {
        console.error('Error fetching images from Unsplash:', error);
        return null;
    }
};

// export const getTemplatesAPI = async () => {
//     const templateAPI = `https://api.polotno.com/api/get-templates?size=2560x1440&query=&per_page=30&page=1&KEY=nFA5H9elEytDyPyvKL7T`
//     return (await axios.get(templateAPI))?.data?.items;
// }

// export const getTemplateDataAPI = async (templateUrl: string) => {
//     return (await axios.get(templateUrl));
// }

// export const searchTemplatesAPI = async (searchQuery: string) => {
//     const templateSearchAPI = `https://api.polotno.com/api/get-templates?size=2560x1440&query=${searchQuery}&per_page=30&page=1&KEY=nFA5H9elEytDyPyvKL7T`
//     return (await axios.get(templateSearchAPI))?.data?.items;
// }

// export const searchIconsAPI = async (searchQuery: string) => {
//     const templateSearchAPI = `https://api.polotno.dev/api/get-iconfinder?query=${searchQuery}&offset=0&count=100&KEY=nFA5H9elEytDyPyvKL7T`;
//     const response = (await axios.get(templateSearchAPI))?.data?.icons.map((list: any) => list.raster_sizes[6]?.formats[0]?.preview_url)
//     return response;
// }

// ============ Product Prompt Generation ================

export const generateProductPromptAPI = async (data: { init_image: string | null; product: string; placement: string; surrounding: string; background: string; style_selections: string; }) => {
    try {
        const url = ML_API + productModelEndPoints?.generateProductPrompt?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('product', data.product);
        formData.append('placement', data.placement);
        formData.append('surrounding', data.surrounding);
        formData.append('background', data.background);
        formData.append('style_selections', data.style_selections);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Product Model Generation ================

export const generateProductAPI = async (data: { init_image: any; mask_image: any; prompt: any; num_images: any; image_harmonizer: any; }) => {
    try {
        const url = ML_API + productModelEndPoints?.generateProductModel?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('mask_image', data.mask_image!);
        formData.append('prompt', data.prompt);
        formData.append('num_images', data.num_images);
        formData.append('image_harmonizer', data.image_harmonizer);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Upscale Image Generation ================

export const upscaleImageAPI = async (data: { init_image: string | Blob; upscale_type: string; scale: string; }) => {
    try {
        const url = ML_API + productModelEndPoints?.upscaleImage?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('upscale_type', data.upscale_type);
        formData.append('scale', data.scale);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Outpaint Image Generation ================

export const outpaintImageAPI = async (data: { init_image: any; prompt: any; image_width: any; image_height: any; image_x_l: any; image_x_r: any; image_y_t: any; image_y_b: any; canvas_width: any; canvas_height: any; }) => {
    try {
        const url = ML_API + productModelEndPoints?.outpaintImage?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('prompt', data.prompt);
        formData.append('image_width', data.image_width);
        formData.append('image_height', data.image_height);
        formData.append('image_x_l', data.image_x_l);
        formData.append('image_x_r', data.image_x_r);
        formData.append('image_y_t', data.image_y_t);
        formData.append('image_y_b', data.image_y_b);
        formData.append('canvas_width', data.canvas_width);
        formData.append('canvas_height', data.canvas_height);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Background Remove Image Generation ================

export const bgRemoveAPI = async (data: { init_image: any; rm_type: any; }) => {
    try {
        const url = ML_API + productModelEndPoints?.removebg?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('rm_type', data.rm_type);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Magic Remove from Image ================

export const magicRemoveAPI = async (data: { init_image: string; mask_image: string }) => {
    try {
        const url = ML_API + productModelEndPoints?.magicRemover?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('mask_image', data.mask_image!);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Magic Replaced Image Generation ================

export const magicReplaceAPI = async (data: { init_image: string | Blob; mask_image: string | Blob; prompt: string; }) => {
    try {
        const url = ML_API + productModelEndPoints?.magicReplace?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('mask_image', data.mask_image!);
        formData.append('prompt', data.prompt);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}


// ============ Product Prompt Generation ================

export const generateModelPromptAPI = async (data: { init_image: string | Blob; style_selections: string; }) => {
    try {
        const url = ML_API + ModelStudioEndPoints?.generateModelPrompt?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('style_selections', data.style_selections);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Model Studio Generation ================

export const modelStudioAPI = async (data: { face_image: string | Blob; pose_image: string | Blob; prompt: string | Blob; num_images: string; refine: boolean; }) => {
    try {
        const url = ML_API + ModelStudioEndPoints?.generateModelStudio?.url;

        const formData = new FormData();
        formData.append('face_image', data.face_image!);
        formData.append('pose_image', data.pose_image!);
        formData.append('prompt', data.prompt);
        formData.append('num_images', data.num_images);
        formData.append('refine', data.refine.toString());

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Model Studio Harmonize API ================

export const modelStudioHarmonizeAPI = async (data: { init_image?: string | Blob; mask_image?: string | Blob }) => {
    try {
        const url = ML_API + ModelStudioEndPoints?.harmonizer?.url;

        const formData = new FormData();
        formData.append('init_image', data.init_image!);
        formData.append('mask_image', data.mask_image!);

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Login User API ================

export const userLoginAPI = async (data: { email: string; password: string; }) => {
    try {
        const url = API_END_POINT + authEndPoint?.login?.url;

        const formData = {
            email: data.email,
            password: data.password
        }

        const response = await axios.post(url, formData);
        if (response?.data) {
            return response.data;
        } else {
            throw Error("Unable to get response")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}

// ============ Backup Data API ================

export const backupToDataBaseAPI = async (data) => {
    try {
        const url = API_END_POINT + backupEndPoint?.save?.url;  //change

        const response = await axios.post(url, data);
        if (response?.data) {  //check
            return response.data;
        } else {
            throw Error("Unable to backup")
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}