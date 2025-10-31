const express = require("express");
const Journal = require("../models/Journal");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get user's journals
router.get("/", auth, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all journals (Admin only)
router.get("/all", auth, adminAuth, async (req, res) => {
  try {
    const journals = await Journal.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create journal
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const journal = new Journal({
      userId: req.user._id,
      title,
      content,
      mood: mood || "neutral",
    });

    await journal.save();
    res.status(201).json({ message: "Journal created successfully", journal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update journal
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (title) journal.title = title;
    if (content) journal.content = content;
    if (mood) journal.mood = mood;
    journal.updatedAt = Date.now();

    await journal.save();
    res.json({ message: "Journal updated successfully", journal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete journal
router.delete("/:id", auth, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!journal) {
      // Check if admin
      if (req.user.role === "admin") {
        const adminJournal = await Journal.findByIdAndDelete(req.params.id);
        if (adminJournal) {
          return res.json({ message: "Journal deleted successfully" });
        }
      }
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json({ message: "Journal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
