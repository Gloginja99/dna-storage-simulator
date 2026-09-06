import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { HistoryService } from "../services/history.service";
import { requireAuth } from "../middleware/auth.middleware";

const historyRouter = Router();
const historyController = new HistoryController(new HistoryService());

historyRouter.use(requireAuth);
historyRouter.post("/", historyController.save);
historyRouter.get("/", historyController.list);
historyRouter.get("/:id", historyController.getById);
historyRouter.delete("/:id", historyController.remove);

export { historyRouter };
