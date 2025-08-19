import express, { Request, Response, NextFunction } from "express";
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

const setResponse = (username: string, repos: number) => {
  return `<h2>${username} has ${repos} public repositories</h2>`;
};

const getRepos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Fetching data");
    const username = req.params.username;
    const data = await fetch(`https://api.github.com/users/${username}`);
    if (!data.ok) {
      return res
        .status(data.status)
        .send(`<h2>GitHub request failed: ${data.statusText}</h2>`);
    }
    const userData = await data.json();
    const repos = Number(userData.public_repos ?? 0);

    // Cache for 1 hour (3600s). setEx expects a string value.
    redisClient.setEx(username, 3600, repos.toString());

    res.send(setResponse(username, repos));
  } catch (error) {
    console.error(error);
    return res.status(500).send("<h2>Internal server error</h2>");
  }
};

app.get("/repos/:username", getRepos);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
