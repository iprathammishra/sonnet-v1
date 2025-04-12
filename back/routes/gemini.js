const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require('multer');

const router = express.Router();
const API_KEY = process.env.GEMINI_API;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No audio file uploaded.');
    }

    const audioBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const audioBase64 = audioBuffer.toString('base64');

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const transcriptionResult = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: audioBase64,
        },
      },
      { text: "Generate a transcript of the speech." },
    ]);

    const transcript = transcriptionResult.response.text();
    
    const prompt = `
              This is the distorted transcription of my audio file from my today's college lecture.
              Audio Transcription: <${transcript}>

              ---------

              The text may have minor distortions, but I want you to generate a concise yet detailed 1500-word summary of everything we discussed in the lecture. Focus on the lecture's key points, explanations, and discussions and explain some major topics that were discussed in the lecture in a short paragraph. 

              Avoid generic introductions like "Here's the summary". 
              Instead, start with a natural flow — for example, "Today we explored..." or "In today's class...". 
              Maintain a clear, organized structure that reflects how the lecture unfolded.`;

    const summaryResult = await model.generateContent(prompt);
    
    res.send({ summary: summaryResult.response.text() });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).send({ error: "Failed to transcribe audio." });
  }
});

module.exports = router;