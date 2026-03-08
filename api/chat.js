// api/chat.js — Vercel Serverless Function (Groq)

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed. Use POST."
    });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Server configuration error: GROQ_API_KEY is missing"
    });
  }

  try {
    // Safely parse request body
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid request: 'messages' array is required"
      });
    }

    // Call Groq API
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: messages,
          max_tokens: 512
        })
      }
    );

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: "Groq API error",
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Groq API request failed:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
