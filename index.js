import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// API endpoint
app.post("/api/ask", async (req, res) => {
  const { question, profile } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are in an interview. Your profile: ${profile}. Answer like a human candidate in simple sentences.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const answer = completion.choices[0]?.message?.content || "No answer found.";
    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Root route (optional) so visiting "/" shows a friendly message
app.get("/", (req, res) => {
  res.send("Backend is running! Use POST /api/ask for the AI bot.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
