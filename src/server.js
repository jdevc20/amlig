require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes")
const connectDB = require("./config/db"); // Import DB connection

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || "BatchoyNgaMayPuto",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.json({ message: "🚀 Server is running!" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", {
        message: err.message,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack,
    });

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

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
