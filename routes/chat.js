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

Based on the following content, generate ${numberOfQuestions} well-structured test questions that include both multiple-choice and matching formats.
Generate all questions and answers in Uzbek language based on the provided Uzbek content.
Questions should be 20% to 80% {20% Matching heading and 80% Multiple-choice heading} of the total number of questions.
For multiple-choice questions:
- Create challenging questions that test deeper understanding
- Include well-designed distractors (wrong answers) that are plausible and relate to the content
- Ensure distractors contain content-relevant but incorrect information that might confuse students who have only surface knowledge
- Four answer choices (a–d)
- The correct answer indicated at the end

For matching questions:
- Create pairs of items that must be correctly matched
- Include some extra items in one column to increase difficulty
- Clearly label which items go in which column

Use these formats exactly:

MULTIPLE-CHOICE FORMAT:
1. What is the capital of France?
a) Berlin 
b) Madrid 
c) Paris 
d) Lyon 
Answer: c)

MATCHING FORMAT:
Match the historical figures in Column A with their achievements in Column B.

Column A:
1) Napoleon Bonaparte
2) Louis XIV
3) Charles de Gaulle

Column B:
a) Led Free French Forces during WWII
b) Known as the "Sun King"
c) Established the Fifth Republic
d) Created the Napoleonic Code
e) Built the Palace of Versailles

A)1-d, 2-b,e, 3-a,c
B)1-a, 2-b,d, 3-c,e
C)1-c, 2-a,c 3-b,d
D)1-b, 2-c,d 3-a,e

Answers: 1-d, 2-b,e, 3-a,c

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
