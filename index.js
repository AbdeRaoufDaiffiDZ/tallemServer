const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const authRouter = require("./routes/auth");
const moduleRouter = require("./routes/module");
const notifiRouter = require("./routes/notifi");
const Notifi = require("./models/notification");

const port = process.env.PORT || 3000;
const DB = "mongodb+srv://raouf:raouf@cluster0.59byr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error("MongoDB connection error:", e));

app.use(express.json()); // Single middleware definition
app.use(authRouter);
app.use(moduleRouter);
app.use(notifiRouter);

app.get("/", (req, res) => {
  console.log("Request at /");
  res.send("Hello, world!");
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sent_notification", async ({ title, body, type, link }) => {
    try {
      const notifi = new Notifi({ title, body, type, link });
      await notifi.save();
      console.log("Notification saved");
      io.emit("new_notification", notifi);
    } catch (error) {
      console.error("Error in sent_notification:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("edit_notification", async ({ _id, body, Qanswer }) => {
    try {
      if (!_id) throw new Error("Notification ID is required");
      const notifi = await Notifi.findById(_id);
      if (!notifi) throw new Error("Notification not found");

      if (body) notifi.body = body;
      if (Qanswer) notifi.Qanswer = Qanswer;
      await notifi.save();
      console.log("Notification updated");
      io.emit("new_notification", notifi);
    } catch (error) {
      console.error("Error in edit_notification:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("remove_notification", async ({ _id }) => {
    try {
      if (!_id) throw new Error("Notification ID is required");
      const result = await Notifi.deleteOne({ _id });
      if (result.deletedCount === 0) throw new Error("Notification not found");
      console.log("Notification removed");
      io.emit("remove_notification_success", _id);
    } catch (error) {
      console.error("Error in remove_notification:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Handle uncaught routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});