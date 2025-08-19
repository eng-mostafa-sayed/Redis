import express, { Request, Response } from "express";

const PORT = process.env.PORT || 5000;
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
