const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

/* =========================
   CORS CONFIGURATION
   ========================= */
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      // Allow localhost and all Vercel deployments
      if (
        origin.startsWith("http://localhost") ||
        origin.includes(".vercel.app")
      ) {
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* =========================
   MIDDLEWARE
   ========================= */
app.use(express.json());

/* =========================
   ROUTES
   ========================= */
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

/* =========================
   HEALTH CHECK
   ========================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SmartSpend API is running 🚀",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
   ========================= */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   START SERVER
   ========================= */
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
