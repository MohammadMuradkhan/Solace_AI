import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();
const app = express();

// ✅ 1. CORS (clean config)
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

// ❌ REMOVE this (important)
// app.options("*", cors());

// ✅ 2. Middlewares
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

// ✅ 3. Routes
app.use("/api/v1", appRouter);

export default app;