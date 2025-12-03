import express from "express";

const app = express();

// Parse incoming JSON requests so you can access req.body
app.use(express.json());

// Root route(test)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Library API is running",
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
