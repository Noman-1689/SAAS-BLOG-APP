import Groq from "groq-sdk";
import { PrismaClient } from "@prisma/client"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const prisma = new PrismaClient();

export const generateArticle = async (req, res) => {
  try {
    // 1. Get topic and wordCount from body, and authorId from auth middleware
    const { topic, wordCount } = req.body;
    const authorId = req.userId;
    console.log("authorId", authorId);

    // Validation
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    if (!authorId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Please log in to generate articles." });
    }

    // 2. Format AI instructions
    const lengthInstruction = wordCount
      ? `The article length must be strictly around ${wordCount} words.`
      : "The article should be of standard blog length (approx 500-700 words).";

    // 3. Generate content with Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional blog writer. ${lengthInstruction} Generate a well-structured article with a title, introduction, body paragraphs, and a conclusion in Markdown format.`,
        },
        {
          role: "user",
          content: `Write a detailed article about: ${topic}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const articleContent = chatCompletion.choices[0]?.message?.content;

    if (!articleContent) {
      throw new Error("AI failed to generate content.");
    }

    // 4. SAVE TO DATABASE
    // Note: wordCount is parsed to an Integer to match your Prisma schema
    const savedArticle = await prisma.article.create({
      data: {
        topic: topic,
        wordCount: parseInt(wordCount) || 600,
        content: articleContent,
        authorId: authorId,
      },
    });

    // 5. Return the saved database record
    res.status(201).json({
      success: true,
      data: savedArticle,
    });
  } catch (error) {
    console.error("Article Generation/Save Error:", error);
    res.status(500).json({ error: "Failed to generate or store the article." });
  }
};

// controllers/articleController.js (Add this)
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: id },
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch article" });
  }
};