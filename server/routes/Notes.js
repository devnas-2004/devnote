// routes/notes.js
import express from "express";
import Note from "../models/Note.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET all notes for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST new note
router.post("/", verifyToken, async (req, res) => {
  try {
    const newNote = new Note({ ...req.body, user: req.userId });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update note (only if it belongs to the user)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE note (only if it belongs to the user)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
