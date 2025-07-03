const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");
const subtaskRoutes = require("./routes/subtaskRoutes");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// ✅ Apply middleware BEFORE routes
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // For parsing application/json

// ✅ Routes (AFTER middleware)
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subtasks", subtaskRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
