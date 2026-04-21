import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";

import notesRoutes from "./routes/Notes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware


import cors from "cors";

const corsOptions = {
  origin: "https://devnote-git-main-devnas-2004s-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));



app.use(express.json());

// Routes
//app.use("/api/notes", notesRoutes);
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