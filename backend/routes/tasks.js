const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  priority: String,
  category: String,
  columnId: String,
  attachments: [
    {
      id: String,
      name: String,
      url: String,
      type: String,
    }
  ],
  createdAt: Number,
}, { collection: 'kanban-tasks' });
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    // Set default columnId if not provided
    if (!data.columnId) data.columnId = "todo";
    // Set default attachments if not provided
    if (!data.attachments) data.attachments = [];
    // Set createdAt if not provided
    if (!data.createdAt) data.createdAt = Date.now();
    const task = new Task(data);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { returnDocument: "after" }
    );
    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
