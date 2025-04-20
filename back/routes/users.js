const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Get all the users
router.get("/", async (req, res) => {
    try {
        const users = await User.find({}); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all notes from a user
router.get("/:userId/notes", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a particular note
router.get("/:userId/notes/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const note = user.notes.id(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add another note
router.post("/:userId", async (req, res) => {
    try {
        const { title, summary } = req.body;
        if (!title || !summary) return res.status(400).json({ message: "Title and Summary are required" });
        
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const newNote = {
            title,
            summary
        };
        
        user.notes.push(newNote);
        await user.save();
        res.status(201).json({message: "Note added successfully"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add multiple notes to a user
router.post("/:userId/batch", async (req, res) => {
    try {
        const notes = req.body; // expecting an array of { title, summary }

        if (!Array.isArray(notes) || notes.length === 0) {
            return res.status(400).json({ message: "Expected an array of notes" });
        }

        // Validate notes
        for (let note of notes) {
            if (!note.title || !note.summary) {
                return res.status(400).json({ message: "Each note must have a title and summary" });
            }
        }

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Add all notes
        user.notes.push(...notes);
        await user.save();

        res.status(201).json({ message: "Notes added successfully", totalNotes: user.notes.length });
    } catch (err) {
        console.error("Error adding multiple notes:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// Edit a particular route
router.put("/:userId/notes/:id/title", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const note = user.notes.id(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        note.title = req.body.title || note.title;
        await user.save();

        res.json({ message: "Title updated successfully", updatedNote: note });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Delete a particular note
router.delete("/:userId/notes/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        user.notes = user.notes.filter(note => note._id.toString() !== req.params.id);
        await user.save();
        
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user
router.delete("/:userId", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
