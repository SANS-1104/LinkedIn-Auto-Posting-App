// backend/controllers/imageController.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateImage = async (req, res) => {
  const { prompt } = req.body;

  try {
    // Call DALL·E 3
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "512x512", 
      quality: "high"
    });

    const imageUrl = response.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Image generation failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
};