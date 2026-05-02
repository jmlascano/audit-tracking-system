import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routers/router.js";
import { testConnection } from "./config/database.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));

// Enable CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true, // allow cookies
  })
);

// Console Design ⋆˙⟡ —
console.clear();
console.log("\x1b[35m\x1b[1m%s\x1b[0m", "˚ʚ♡ɞ˚ Backend Server ˚ʚ♡ɞ˚\n");

// App Router
router(app);

// Test database connection
// await testConnection();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  const consoleDesign = [
    "\x1b[36m\x1b[1m🚀 Server is running!\x1b[0m\n",
    `\x1b[33mLocal: \x1b[36mhttp://localhost:${port}\x1b[0m\n`,
    `\x1b[33mPort: \x1b[1m\x1b[32m${port}\x1b[0m\n`,
  ].join("");

  console.log("\x1b[3m%s\x1b[0m", consoleDesign);
});
