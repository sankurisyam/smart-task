require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:3000,http://127.0.0.1:3000,http://51.20.68.160"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Keep local development flexible while still allowing explicit production origins.
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/tasks", require("./routes/taskRoutes"));
app.get("/", (req, res) => {
  res.send("Welcome to the Task Management API");
});
// Health Check (VERY IMPORTANT for DevOps)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  }
})();
