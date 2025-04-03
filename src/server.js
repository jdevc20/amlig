require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Validate required environment variables
if (!process.env.PORT) {
    console.error("⚠️ Missing PORT in .env file");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON requests

// Sample route
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
