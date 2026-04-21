import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";

import notesRoutes from "./routes/Notes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware


import cors from "cors";
const allowedOrigins = [
  "https://devnote-git-main-devnas-2004s-projects.vercel.app",
  "https://devnote-4s4dpong9-devnas-2004s-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);




app.use(express.json());

// Routes
app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => res.send("API is running..."));

// DB + Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");  // add this
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch(err => console.log("MongoDB error:", err));