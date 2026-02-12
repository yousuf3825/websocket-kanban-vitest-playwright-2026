
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");


const app = express();
app.use(express.json());
// Mount tasks API
app.use("/api/tasks", require("./routes/tasks"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


// MongoDB Atlas connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/kanban";
mongoose.connect(mongoUri);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});


const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  column: String,
  priority: String,
  category: String,
  progress: Number,
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'kanban-tasks' });
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

io.on("connection", (socket) => {
  console.log("A user connected");


  // Send all tasks to newly connected client
  Task.find({}, (err, tasks) => {
    if (!err) {
      socket.emit("sync:tasks", tasks);
    }
  });


  // Create task
  socket.on("task:create", async (task) => {
    try {
      const newTask = new Task(task);
      await newTask.save();
      const tasks = await Task.find({});
      io.emit("sync:tasks", tasks);
    } catch (e) {
      console.error(e);
    }
  });


  // Update task
  socket.on("task:update", async (updatedTask) => {
    try {
      await Task.findOneAndUpdate({ id: updatedTask.id }, updatedTask);
      const tasks = await Task.find({});
      io.emit("sync:tasks", tasks);
    } catch (e) {
      console.error(e);
    }
  });


  // Move task
  socket.on("task:move", async ({ id, column }) => {
    try {
      await Task.findOneAndUpdate({ id }, { column });
      const tasks = await Task.find({});
      io.emit("sync:tasks", tasks);
    } catch (e) {
      console.error(e);
    }
  });


  // Delete task
  socket.on("task:delete", async (id) => {
    try {
      await Task.deleteOne({ id });
      const tasks = await Task.find({});
      io.emit("sync:tasks", tasks);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
