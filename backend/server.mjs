// server.mjs
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const YT_API_KEY = process.env.YT_API_KEY;

if (!GEMINI_KEY) {
  console.error("ERROR: GEMINI_API_KEY not set in .env");
}

const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const MODEL_NAME = "gemini-flash-latest";

// Extract YouTube video ID
function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v");
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.substring(1);
    const m = url.match(/(embed|v|shorts)\/([^?&/]+)/);
    return m ? m[2] : null;
  } catch {
    return null;
  }
}

// Fetch video metadata
async function fetchVideoMetadata(videoId) {
  if (!YT_API_KEY) return null;
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YT_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`YT API responded with ${resp.status}`);
    const data = await resp.json();
    if (!data.items || data.items.length === 0) return null;
    const snippet = data.items[0].snippet;
    return {
      title: snippet.title,
      description: snippet.description,
      tags: snippet.tags || [],
      channel: snippet.channelTitle,
    };
  } catch (err) {
    console.error("fetchVideoMetadata error:", err);
    return null;
  }
}

// POST endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question, videoLink } = req.body || {};
    if (!question) return res.status(400).json({ answer: "Question is required." });
    if (!videoLink) return res.status(400).json({ answer: "videoLink is required." });

    const videoId = extractVideoId(videoLink);
    if (!videoId) return res.status(400).json({ answer: "Invalid YouTube link." });

    // Try fetching transcript
    let transcriptText = "";
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      transcriptText = transcript.map(t => t.text).join(" ");
    } catch {
      transcriptText = "";
    }

    // Fetch metadata if transcript is missing or even as extra context
    const metadata = await fetchVideoMetadata(videoId);

    // Create Gemini model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Construct prompt
    const prompt = `
The user is watching this YouTube video: ${videoLink}

${transcriptText ? `Transcript (context):\n${transcriptText}\n` : ""}
Video metadata (if available):
Title: ${metadata?.title || "Unknown"}
Description: ${metadata?.description || "Unknown"}
Tags: ${metadata?.tags?.join(", ") || "None"}
Channel: ${metadata?.channel || "Unknown"}

User question:
${question}

Answer the question using the transcript if available, otherwise use metadata and general knowledge.
Keep it concise (2–4 sentences). Do NOT say "Transcript not available".
`;

    const result = await model.generateContent(prompt);
    const text = result?.response?.text ? result.response.text() : null;

    if (!text) {
      return res.status(500).json({ answer: "AI returned empty response." });
    }

    return res.json({ answer: text });
  } catch (err) {
    console.error("Unhandled server error:", err);
    return res.status(500).json({ answer: `Server error: ${err.message || String(err)}` });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
