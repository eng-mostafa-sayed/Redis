import express, { Request, Response } from "express";
import fetch from "node-fetch";

const PORT = process.env.PORT || 5000;
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
