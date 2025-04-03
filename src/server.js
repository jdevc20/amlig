require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const connectDB = require("./config/db"); // Import DB connection

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 CORS: Allow all origins, but keep credentials support
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins dynamically
  },
  credentials: true, // Allows session cookies & authentication headers
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// 🔹 Connect to database
connectDB();

// 🔹 Session Middleware (Updated)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "BatchoyNgaMayPuto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Protects against XSS
      secure: false, // Set to true in production (HTTPS only)
      sameSite: "lax", // Helps with CSRF protection
      maxAge: 1000 * 60 * 60 * 24, // 1-day session duration
    },
  })
);

// 🔹 Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

// 🔹 Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🚀 Server is running!" });
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
});

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
