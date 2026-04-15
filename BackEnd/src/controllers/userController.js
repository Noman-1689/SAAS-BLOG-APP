// src/controllers/userController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserLibrary = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch assets in parallel
    // We replace images with resumeReviews
    const [articles, titles, resumes] = await Promise.all([
      prisma.article.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.blogTitle.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.resumeReview.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.status(200).json({
      success: true,
      library: {
        articles,
        titles,
        resumes, // Changed key from 'images' to 'resumes' to match frontend state
      },
    });
  } catch (error) {
    console.error("Library Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch your library." });
  }
};
