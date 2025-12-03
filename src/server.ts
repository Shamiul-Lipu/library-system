import app from "./app";
import config from "./config";

const port = config.port;

async function startServer() {
  try {
    app.listen(port, () => {
      console.log(`Server is running at ${port}`);
    });
  } catch (error) {
    console.log("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
