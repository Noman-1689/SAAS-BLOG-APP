import Groq from "groq-sdk";
import { PrismaClient } from "@prisma/client";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const prisma = new PrismaClient();

export const reviewResume = async (req, res) => {
  try {
    const { resumeText, field } = req.body || {};
    const authorId = req.userId;

    // ✅ Validation
    if (!resumeText) {
      return res.status(400).json({
        message: "Resume content is required",
      });
    }

    if (!field) {
      return res.status(400).json({
        message: "Target field/job role is required",
      });
    }

    if (!authorId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ Clean + Trim text (VERY IMPORTANT)
    const safeResumeText = resumeText
      .replace(/[\u0000-\u001F]+/g, " ")
      .slice(0, 12000); // prevent token overflow

    // ✅ AI CALL (STRICT JSON MODE)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are an expert ATS (Applicant Tracking System) and senior recruiter.

Analyze resumes for the role: ${field}

SCORING RULES:
- Relevance (0–30)
- Skills (0–25)
- Experience (0–20)
- Formatting (0–15)
- Impact (0–10)

TOTAL = 100

STRICT RULES:
- Return ONLY JSON
- No explanation
- No markdown
- No extra text

JSON FORMAT:

{
  "score": number,
  "breakdown": {
    "relevance": number,
    "skills": number,
    "experience": number,
    "formatting": number,
    "impact": number
  },
  "strengths": ["point"],
  "weaknesses": ["point"],
  "suggestions": ["point"]
}
          `,
        },
        {
          role: "user",
          content: safeResumeText,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      max_tokens: 2048,

      // 🔥 THIS IS THE KEY FIX
      response_format: { type: "json_object" },
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("AI failed to analyze resume.");
    }

    console.log("AI RAW RESPONSE:", aiResponse);

    // ✅ SAFE PARSE (no regex hacks anymore)
    let parsed;

    try {
      parsed = JSON.parse(aiResponse);
    } catch (err) {
      console.error("Parsing failed:", err);

      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: aiResponse, // helps debugging
      });
    }

    // ✅ Validate AI output (extra safety)
    if (typeof parsed.score !== "number") {
      return res.status(500).json({
        error: "Invalid AI response structure",
        raw: parsed,
      });
    }

    // ✅ Save to DB
    const savedReview = await prisma.resumeReview.create({
      data: {
        content: resumeText,
        score: parsed.score,
        feedback: JSON.stringify(parsed),
        authorId: authorId,
      },
    });

    // ✅ Response
    res.status(201).json({
      success: true,
      data: {
        ...savedReview,
        parsed,
      },
    });
  } catch (error) {
    console.error("Resume Review Error:", error);
    res.status(500).json({
      error: "Failed to analyze resume.",
    });
  }
};
export const getResumeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const resume = await prisma.resumeReview.findUnique({
      where: {
        id: id,
      },
    });

    // Security check: ensure the user owns this resume
    if (!resume || resume.authorId !== userId) {
      return res.status(404).json({ error: "Resume review not found." });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resume details." });
  }
};
