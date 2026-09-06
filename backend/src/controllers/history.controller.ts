import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { HistoryError, HistoryService } from "../services/history.service";
import { SaveSimulationRequestBody } from "../types/auth.api";

export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  save = async (
    req: AuthenticatedRequest & { body: SaveSimulationRequestBody },
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.historyService.save(req.userId!, req.body);
      res.status(201).json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.historyService.list(req.userId!);
      res.json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.historyService.getById(
        req.userId!,
        String(req.params.id),
      );
      res.json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.historyService.remove(req.userId!, String(req.params.id));
      res.status(204).send();
    } catch (err) {
      this.handleError(err, res);
    }
  };

  private handleError(err: unknown, res: Response): void {
    if (err instanceof HistoryError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
