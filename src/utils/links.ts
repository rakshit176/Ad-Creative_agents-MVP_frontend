// export const ML_API = "http://192.168.218.177:5056/";
// export const ML_API = "http://ec2-3-223-199-109.compute-1.amazonaws.com:7500/";
// export const ML_API = "http://65.19.181.199:7500/";
export const ML_API = "https://genai.krut.ai/";

export const API_END_POINT = "https://api.krut.ai/";
// export const API_END_POINT = "https://mgjnvftk-3000.inc1.devtunnels.ms/";

export const authEndPoint = {
    login: {
        url: 'api/v1/auth/login',
        method: 'POST',
    },
    // register: {
    //   url: 'api/v1/auth/register',
    //   method: 'POST',
    // },
};

export const backupEndPoint = {
    save: {
        url: 'api/v1/backup/save', //change
        method: 'POST',
    },

};

export const productModelEndPoints = {
    generateProductPrompt: {
        url: 'krut_ai/generate_prompt_product',
        method: "POST"
    },
    generateProductModel: {
        url: 'krut_ai/product_studio',
        method: "POST"
    },
    upscaleImage: {
        url: 'krut_ai/upscale',
        method: "POST"
    },
    outpaintImage: {
        url: 'krut_ai/outpaint',
        method: "POST"
    },
    removebg: {
        url: 'krut_ai/removebg',
        method: "POST"
    },
    magicRemover: {
        url: 'krut_ai/magic_remover',
        method: "POST"
    },
    magicReplace: {
        url: 'krut_ai/magic_replace',
        method: "POST"
    },
}

export const ModelStudioEndPoints = {
    generateModelPrompt: {
        url: 'krut_ai/generate_prompt',
        method: "POST"
    },
    generateModelStudio: {
        url: 'krut_ai/model_studio',
        method: "POST"
    },
    harmonizer: {
        url: 'krut_ai/harmonizer',
        method: "POST"
    },
   
}
