import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); // Ensure this is at the top


const router = express.Router();


const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";





router.post("/chat", async (req, res) => {
  const { text, numberOfQuestions } = req.body;


  if (!text || !numberOfQuestions) {
    return res.status(400).json({ error: "Text and numberOfQuestions are required." });
  }

  const prompt = `You are a helpful AI assistant that creates advanced history test questions.

Based on the following content, generate ${numberOfQuestions} well-structured test questions in Uzbek language.

Requirements:
- All questions must be 100% in MULTIPLE-CHOICE format.
- DO NOT include matching, true/false, or open-ended questions.
- Each question must be factual and specific (e.g., involving country names, kings' names, historical figures, dates, wars, cities, or regions).
- DO NOT ask abstract or reasoning-based questions (e.g., "Why did..." or "What was the purpose of...").
- The questions should be difficult and require close attention to factual details in the text.

Multiple-choice formatting guidelines:
- Each question must have exactly four options: a), b), c), and d).
- Include strong distractors that are content-relevant but incorrect, to confuse students who only have surface-level understanding.
- Place the correct answer at the end in the format: Answer: c)

Use this format exactly:

MULTIPLE-CHOICE FORMAT:
1. Fransiyaning poytaxti qaysi shahar?
a) Berlin 
b) Madrid 
c) Parij 
d) Lion 
Answer: c)

Important:
- Present all questions in a single, continuous block to allow for easy copy-paste into Google Docs.
- Do not split or group questions into separate sections.

Content to use:
---
${text}
---
`;

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: "claude-3-opus-20240229",
        max_tokens: 2000,
        system: "You are a test generator bot that helps history teachers.",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "x-api-key": CLAUDE_API_KEY,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const content = response.data?.content;
    const reply =
      Array.isArray(content) && content.length > 0
        ? content[0].text
        : "No response from Claude.";

    res.json({ reply });
  } catch (error) {
    console.error(
      "Error communicating with Claude:",
      error?.response?.data || error.message
    );
    res.status(500).send("Error communicating with Claude AI!");
  }
});

export default router;
