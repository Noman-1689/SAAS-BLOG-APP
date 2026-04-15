import axios from "axios";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const generateBlogImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const authorId = req.userId;

    const prompt = `${title}, ${description}, cinematic lighting, high resolution, 8k, highly detailed, professional digital art, trending on artstation, masterpiece`;

    // 2026 Update: Use the router prefix with a modern model ID
    const url = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";

    const response = await axios.post(
      url,
      {
        inputs: prompt,
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 20, // Flux Schnell is optimized for fewer steps (4-20)
        },
        options: { wait_for_model: true },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "image/jpeg",
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    res.status(201).json({
      success: true,
      imagePreview: `data:image/jpeg;base64,${base64Image}`,
    });
  } catch (error) {
    if (error.response && error.response.data instanceof Buffer) {
      try {
        const errorMsg = JSON.parse(error.response.data.toString());
        console.error("Hugging Face Detailed Error:", errorMsg);
        return res.status(error.response.status).json(errorMsg);
      } catch (parseError) {
        console.error("Raw Error Buffer:", error.response.data.toString());
      }
    }

    console.error("System Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};