import express from 'express';
import axios from 'axios';

const router = express.Router();

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

const systemPrompt = `
You are Bardak Bot, a helpful coding assistant.

Always format your replies using Markdown. Use:
- Headings (##, ###)
- Bullet points (-)
- Code blocks (with proper syntax highlighting like \`\`\`js)
- Bold or italic text where needed
- Don't respond in a single long paragraph — structure responses clearly.
`;

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: message,
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
