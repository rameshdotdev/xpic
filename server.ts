import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/tweet/:id", async (req, res) => {
    try {
      const tweetId = req.params.id;
      const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        return res.status(response.status).json({ error: `Twitter API returned ${response.status}` });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching tweet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/proxy-image", async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) return res.status(400).json({ error: "URL is required" });
      
      const response = await fetch(imageUrl);
      if (!response.ok) return res.status(response.status).json({ error: "Failed to fetch image" });
      
      const contentType = response.headers.get("content-type");
      if (contentType) res.setHeader("Content-Type", contentType);
      
      response.body.pipe(res);
    } catch (error) {
      console.error("Error proxying image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
