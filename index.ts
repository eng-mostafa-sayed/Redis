import express, { Request, Response } from "express";
import { createClient } from "redis";

import fetch from "node-fetch";

const PORT = process.env.PORT || 5000;
const REDIS_PORT = Number(process.env.REDIS_PORT || "6379");

const redisClient = createClient({
  url: `redis://127.0.0.1:${REDIS_PORT}`,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

const app = express();

app.get("/repos/:username", async (req: Request, res: Response) => {
  try {
    console.log("Fetching data");
    const username = req.params.username;
    const data = await fetch(`https://api.github.com/users/${username}`);

    const userData = await data.json();
    const repos = Number(userData.public_repos ?? 0);

    res.send(`<h2>${username} has ${repos} public repositories</h2>`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("<h2>Internal server error</h2>");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
