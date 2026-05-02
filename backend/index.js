import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routers/router.js";
import { testConnection } from "./config/database.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Console Design ⋆˙⟡ —
console.clear();
console.log("\x1b[35m\x1b[1m%s\x1b[0m", "˚ʚ♡ɞ˚ Backend Server ˚ʚ♡ɞ˚\n");

// App Router
router(app);

// Health check — used by Render to verify the service is up
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global error handler — catches anything passed via next(err) or unhandled throws
app.use((err, _req, res, _next) => {
  console.error(err.stack ?? err.message ?? err);
  res.status(err.status ?? 500).json({ error: err.message ?? "Internal server error" });
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  const consoleDesign = [
    "\x1b[36m\x1b[1m🚀 Server is running!\x1b[0m\n",
    `\x1b[33mLocal: \x1b[36mhttp://localhost:${port}\x1b[0m\n`,
    `\x1b[33mPort: \x1b[1m\x1b[32m${port}\x1b[0m\n`,
  ].join("");

  console.log("\x1b[3m%s\x1b[0m", consoleDesign);
  await testConnection();
});
