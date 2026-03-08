// api/chat.js — Vercel Serverless Function (Groq)

export default async function handler(req, res) {

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed. Use POST."
    });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Server configuration error: GROQ_API_KEY missing"
    });
  }

  try {

    // Parse body safely
    let body = req.body;

    if (!body) {
      return res.status(400).json({
        error: "Request body is required"
      });
    }

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request: messages must be a non-empty array"
      });
    }

    // Call Groq API
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          max_tokens: 512,
          temperature: 0.7,
          top_p: 1
        })
      }
    );

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: "Groq API request failed",
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (err) {

    console.error("API error:", err);

    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });

  }
}
