const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const OpenAI = require("openai");
const multer = require("multer");
const HF_API_KEY = process.env.HF_ACCESS_TOKEN;
const axios = require("axios");

const client = new OpenAI({
	baseURL: "https://router.huggingface.co/hf-inference/v1",
	apiKey: `${HF_API_KEY}`,
});

const upload = multer();
router.post("/process", upload.single("audio"), async (req, res) => {
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
        const transcribedAudio = response.data;
        const prompt = `
                  This is the distorted transcription of my audio file from my today's college lecture.
                  Audio Transcription: <${transcribedAudio.text}>

                  ---------

                  The text may have minor distortions, but I want you to generate a concise yet detailed 2000-word summary of everything we discussed in the lecture. Focus on the lecture's key points, explanations, and discussions and explain some major topics that were discussed in the lecture in a short paragraph. 
                  
                  Avoid generic introductions like "Here's the summary". 
                  Instead, start with a natural flow — for example, "Today we explored..." or "In today's class...". 
                  Maintain a clear, organized structure that reflects how the lecture unfolded.`;
        

        const chatCompletion = await client.chat.completions.create({
          model: "mistralai/Mistral-7B-Instruct-v0.3",
          messages: [
            {
              role: "user",
              content: prompt,
            }
          ],
          max_tokens: 5000, 
        });

        console.log(chatCompletion.choices[0].message.content);
        const output = chatCompletion.choices[0].message.content;
        res.json({summary: output});
        
    } catch (err) {
        console.error("Transcription error:", err.response?.data || err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

