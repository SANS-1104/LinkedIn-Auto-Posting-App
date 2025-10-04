// // file: backend/config/generateImage.js

// import axios from "axios";

// export async function generateImageFromPrompt(prompt) {
//     try {
//         const response = await axios.post(
//             "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
//             {
//                 text_prompts: [{ text: prompt }],
//                 cfg_scale: 8,
//                 height: 1024,
//                 width: 1024,
//                 samples: 1,
//                 steps: 30,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
//                     "Content-Type": "application/json",
//                     Accept: "application/json",
//                 },
//                 responseType: "arraybuffer", // Get raw image buffer
//             }
//         );

//         const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data).toString("base64")}`;
//         return base64Image;
//     } catch (error) {
//         if (error.response?.data instanceof Buffer) {
//             const errorText = error.response.data.toString("utf-8");
//             try {
//                 const parsedError = JSON.parse(errorText);
//                 console.error("Stability AI error response:", parsedError);
//             } catch (jsonErr) {
//                 console.error("Non-JSON error response:", errorText);
//             }
//         } else {
//             console.error("Stability AI image gen failed:", error.message);
//         }

//         return null;
//     }
// }
