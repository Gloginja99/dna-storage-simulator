import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import { healthRouter } from "./routes/health.routes";
import { simulationRouter } from "./routes/simulation.routes";
import { authRouter } from "./routes/auth.routes";
import { historyRouter } from "./routes/history.routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/simulation", simulationRouter);
app.use("/api/auth", authRouter);
app.use("/api/history", historyRouter);

app.use((req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
