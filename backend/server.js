import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FLASK_URL = process.env.FLASK_URL || "http://localhost:5000";

// Middleware
app.use(cors());
app.use(express.json());

// Proxy endpoints to Flask API
app.post("/api/camera/start", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_URL}/api/camera/start`);
    res.json(response.data);
  } catch (error) {
    console.error("Error starting camera:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to start camera",
    });
  }
});

app.post("/api/camera/stop", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_URL}/api/camera/stop`);
    res.json(response.data);
  } catch (error) {
    console.error("Error stopping camera:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to stop camera",
    });
  }
});

app.get("/api/camera/status", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_URL}/api/camera/status`);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting camera status:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to get camera status",
    });
  }
});

// Proxy video stream - pass through the stream
app.get("/api/camera/stream", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_URL}/api/camera/stream`, {
      responseType: "stream",
      headers: {
        Accept: "multipart/x-mixed-replace; boundary=frame",
      },
    });

    res.setHeader("Content-Type", "multipart/x-mixed-replace; boundary=frame");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    response.data.pipe(res);
  } catch (error) {
    console.error("Error streaming video:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to stream video",
    });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_URL}/api/health`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Flask API is not available",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js API server running on http://localhost:${PORT}`);
  console.log(`Proxying to Flask API at ${FLASK_URL}`);
});





