import { Router } from "express";
import { SimulationController } from "../controllers/simulation.controller";
import { SimulationService } from "../services/simulation.service";

const simulationRouter = Router();
const simulationController = new SimulationController(new SimulationService());

simulationRouter.post("/encode", simulationController.encode);
simulationRouter.post("/errors", simulationController.simulateErrors);
simulationRouter.post("/recover", simulationController.recover);

export { simulationRouter };
