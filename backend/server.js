import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import pool, { initDb } from "./db.js";

dotenv.config();
// console.log("dfdffdfdf", process.env.FRONTEND_ORIGIN);
const app = express();
const PORT = process.env.PORT || 3001;
const FLASK_URL = process.env.FLASK_URL || "http://localhost:5000";
const JWT_SECRET = process.env.JWT_SECRET || "ecobot-secret-change-in-production";
const COOKIE_NAME = "ecobot_token";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// In-memory OTP store (email -> { otp, expiresAt })
const pendingOtps = new Map();

// Nodemailer transporter for password reset emails
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Middleware - allow credentials for HTTP-only cookie
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Ensure DB and table exist
await initDb().catch((err) => {
  console.warn("DB init warning (table may already exist):", err.message);
});

function authMiddleware(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token expired or invalid" });
  }
}

// ----- Auth -----
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  try {
    const [rows] = await pool.query(
      "SELECT id, email, name, password_hash, active FROM users WHERE email = ?",
      [email]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (!user.active) {
      return res.status(403).json({ error: "Account is deactivated" });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Request password reset - send OTP email
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const [rows] = await pool.query(
      "SELECT id, email, active FROM users WHERE email = ?",
      [email]
    );
    const user = rows[0];
    if (!user || !user.active) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    pendingOtps.set(email, { otp, expiresAt });

    try {
      await mailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "EcoBot password reset code",
        text: `Your EcoBot password reset code is: ${otp}\n\nThis code will expire in 10 minutes.`,
        html: `<p>Your EcoBot password reset code is:</p><p style="font-size: 24px; font-weight: bold;">${otp}</p><p>This code will expire in 10 minutes.</p>`,
      });
    } catch (mailErr) {
      console.error("Failed to send reset email:", mailErr);
      return res
        .status(500)
        .json({ error: "Failed to send reset email. Try again later." });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to start reset process" });
  }
});

// Verify OTP and issue short-lived reset token
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }
  const entry = pendingOtps.get(email);
  if (!entry) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }
  const { otp: expectedOtp, expiresAt } = entry;
  if (Date.now() > expiresAt || otp !== expectedOtp) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  // Clear OTP once successfully used
  pendingOtps.delete(email);

  const resetToken = jwt.sign(
    { email, type: "password_reset" },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ resetToken });
});

// Reset password using reset token
app.post("/api/auth/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body || {};
  if (!resetToken || !newPassword) {
    return res
      .status(400)
      .json({ error: "Reset token and new password are required" });
  }
  let decoded;
  try {
    decoded = jwt.verify(resetToken, JWT_SECRET);
  } catch (e) {
    return res.status(400).json({ error: "Reset link expired or invalid" });
  }
  if (!decoded || decoded.type !== "password_reset" || !decoded.email) {
    return res.status(400).json({ error: "Invalid reset token" });
  }

  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [hash, decoded.email]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ----- User management (protected) -----
app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const [[countResult]] = await pool.query(
      "SELECT COUNT(*) AS total FROM users"
    );
    const total = countResult?.total ?? 0;

    const [rows] = await pool.query(
      "SELECT id, email, name, active, created_at FROM users ORDER BY id LIMIT ? OFFSET ?",
      [limit, offset]
    );
    res.json({
      users: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    console.error("List users error:", err);
    res.status(500).json({ error: "Failed to list users" });
  }
});

app.post("/api/users", authMiddleware, async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      "INSERT INTO users (email, password_hash, name, active) VALUES (?, ?, ?, 1)",
      [email, hash, name || ""]
    );
    res.status(201).json({
      user: {
        id: r.insertId,
        email,
        name: name || "",
        active: 1,
      },
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.patch("/api/users/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { email, name, password, active } = req.body || {};
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  try {
    const updates = [];
    const values = [];
    if (typeof email === "string" && email.length) {
      updates.push("email = ?");
      values.push(email);
    }
    if (typeof name === "string") {
      updates.push("name = ?");
      values.push(name);
    }
    if (typeof password === "string" && password.length) {
      updates.push("password_hash = ?");
      values.push(await bcrypt.hash(password, 10));
    }
    if (typeof active === "boolean" || typeof active === "number") {
      updates.push("active = ?");
      values.push(active ? 1 : 0);
    }
    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    values.push(id);
    await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    const [rows] = await pool.query(
      "SELECT id, email, name, active, created_at FROM users WHERE id = ?",
      [id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: rows[0] });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Proxy endpoints to Flask API (no auth required for robot control from same app)
app.post("/api/control/start", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_URL}/api/control/start`);
    res.json(response.data);
  } catch (error) {
    console.error("Error starting manual control:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to start manual control",
    });
  }
});

app.post("/api/control/stop", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_URL}/api/control/stop`);
    res.json(response.data);
  } catch (error) {
    console.error("Error stopping manual control:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to stop manual control",
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

app.get("/api/status", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_URL}/api/status`);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting status:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to get status",
    });
  }
});

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
