const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const OpenAI = require("openai");
const multer = require("multer");
const HF_API_KEY = process.env.HF_ACCESS_TOKEN;
const axios = require("axios");


const upload = multer();
router.post("/transcribe", upload.single("audio"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo",
            req.file.buffer,
            {
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "audio/mp3"
                }
            }
        );
        res.json(response.data);
    } catch (err) {
        console.error("Transcription error:", err.response?.data || err.message);
        res.status(500).json({ error: err.message });
    }
});

const client = new OpenAI({
  baseURL: "https://huggingface.co/api/inference-proxy/together",
  apiKey: HF_API_KEY, 
});

router.post("/:userId/notes/:noteId/", async (req, res) => {
  try {
    const { userId, noteId } = req.params;
    
    if (!userId || !noteId) {
      return res.status(400).json({ error: "User ID and Note ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const note = user.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const messages = [
      {
        role: "user",
        content: `Title of the lecture: <${note.title}>, Audio Transcription: <${note.summary}>
                  This is the audio transcription of my today's lecture at college. 
                  I know the text is a bit distorted. I want you to create a 1000-word summary 
                  of everything that has happened in today's class. 
                  Explain about the topics in short and everything else that has been mentioned today.
                  Consider you are just a generator. Don't start with - here's the summary. Instead, start with- today we discussed.... something like that. Make it sound as real as possible. 
                  `
      }
    ];

    const completion = await client.chat.completions.create({
      model: "mistralai/Mistral-Small-24B-Instruct-2501",
      messages: messages,
      max_tokens: 5000
    });

    const summary = completion.choices[0].message.content;

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

