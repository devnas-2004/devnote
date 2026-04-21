import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

//import notesRoutes from "./routes/Notes.js";
//import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware


app.use(cors({
  origin: [
    "https://devnote-chi.vercel.app"
  ],
  credentials: true
}));
app.options("*", cors());

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