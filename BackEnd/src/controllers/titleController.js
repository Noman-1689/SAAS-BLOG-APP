import Groq from "groq-sdk";
import { PrismaClient } from "@prisma/client";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const prisma = new PrismaClient();

export const generateBlogTitles = async (req, res) => {
  try {
    const { keywords, category } = req.body;
    const authorId = req.userId; // Provided by your 'protect' middleware

    // 1. Validation
    if (!keywords || !category) {
      return res
        .status(400)
        .json({ message: "Provide keywords and a category." });
    }

    if (!authorId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // 2. AI Generation
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an SEO expert. Generate exactly 3 catchy blog titles. 
          Return ONLY a JSON object with a "titles" key containing an array of strings. 
          Do not include any intro text, explanations, or markdown formatting.
          Format: {"titles": ["Title 1", "Title 2", "Title 3"]}`,
        },
        {
          role: "user",
          content: `Category: ${category}. Keywords: ${keywords}.`,
        },
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }, // Ensures valid JSON response
      temperature: 0.8,
    });

    const rawContent = chatCompletion.choices[0]?.message?.content;
    const parsedData = JSON.parse(rawContent);

    // 3. SAVE TO DATABASE
    // We combine category and keywords into 'description' to match your schema
    const savedTitles = await prisma.blogTitle.create({
      data: {
        description: `Category: ${category} | Keywords: ${keywords}`,
        titles: parsedData.titles, // This is your String[] array
        authorId: authorId,
      },
    });

    // 4. Send the database record back to the frontend
    res.status(201).json({
      success: true,
      data: savedTitles, // This includes the ID, titles array, and timestamp
    });
  } catch (error) {
    console.error("Title Generation/Save Error:", error);
    res.status(500).json({ error: "Failed to generate or store titles." });
  }
};

// controllers/titleController.js
export const getTitleSetById = async (req, res) => {
  try {
    const { id } = req.params;
    const titleSet = await prisma.blogTitle.findUnique({
      where: { id: id },
    });
    if (!titleSet) return res.status(404).json({ message: "Set not found" });
    console.log("Fetched Title Set:", titleSet);
    res.status(200).json({ success: true, data: titleSet });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
