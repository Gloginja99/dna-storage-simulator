import { Request, Response } from "express";
import { SimulationService } from "../services/simulation.service";
import {
  EncodeRequestBody,
  EncodeResponse,
  RecoverRequestBody,
  RecoverResponse,
  SimulateErrorsRequestBody,
  SimulateErrorsResponse,
} from "../types/simulation.api";

export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  encode = (
    req: Request<unknown, EncodeResponse, EncodeRequestBody>,
    res: Response<EncodeResponse | { message: string }>,
  ): void => {
    const text =
      typeof req.body?.text === "string"
        ? req.body.text.trim().slice(0, 60)
        : "";

    if (!text) {
      res.status(400).json({ message: "text is required" });
      return;
    }

    const strands = this.simulationService.encodeText(text);
    res.json({ text, strands });
  };

  simulateErrors = (
    req: Request<unknown, SimulateErrorsResponse, SimulateErrorsRequestBody>,
    res: Response<SimulateErrorsResponse | { message: string }>,
  ): void => {
    const { strands, config } = req.body;

    if (!Array.isArray(strands) || !config) {
      res.status(400).json({ message: "strands and config are required" });
      return;
    }

    const simulation = this.simulationService.simulateErrors(strands, config);
    const decodedText = this.simulationService.decodeStrands(
      simulation.strands,
    );

    res.json({
      ...simulation,
      decodedText,
    });
  };

  recover = (
    req: Request<unknown, RecoverResponse, RecoverRequestBody>,
    res: Response<RecoverResponse | { message: string }>,
  ): void => {
    const { erroneousStrands, originalStrands } = req.body;

    if (!Array.isArray(erroneousStrands) || !Array.isArray(originalStrands)) {
      res
        .status(400)
        .json({ message: "erroneousStrands and originalStrands are required" });
      return;
    }

    const result = this.simulationService.recoverStrands(
      erroneousStrands,
      originalStrands,
    );
    res.json(result);
  };
}
