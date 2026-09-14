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

// Ograničavamo obradu konsenzusa na 60 karaktera, sedam čitanja i
// najviše jedno umetanje po izvornoj bazi (četiri izvorne baze -> osam baza).
function validStrands(value: unknown, source = false): boolean {
  if (!Array.isArray(value) || value.length > 60) return false;
  const ids = new Set<string>();
  const bases = (item: unknown, exact = false): boolean =>
    Array.isArray(item) && (exact ? item.length === 4 : item.length <= 8) &&
    item.every((base) => ['A', 'T', 'C', 'G'].includes(base));
  return value.every((strand) => {
    if (!strand || typeof strand.id !== 'string' || ids.has(strand.id) ||
        !bases(strand.bases, source)) return false;
    ids.add(strand.id);
    return strand.reads === undefined ||
      (Array.isArray(strand.reads) && strand.reads.length >= 1 &&
       strand.reads.length <= 7 && strand.reads.every((read: unknown) => bases(read)));
  });
}

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
    const { strands, config } = req.body ?? {};

    if (!validStrands(strands, true) || !config ||
        !Number.isFinite(config.errorRate) || config.errorRate < 0 || config.errorRate > 1 ||
        !Number.isInteger(config.burstLength) || config.burstLength < 1 || config.burstLength > 8 ||
        ![config.enableSubstitution, config.enableInsertion, config.enableDeletion,
          config.enableBurst, config.enableDropout].every((value) => typeof value === 'boolean')) {
      res.status(400).json({ message: "Provide up to 60 four-base strands and valid error settings (rate 0-1, burst length 1-8)." });
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
    const { erroneousStrands, originalStrands, algorithm = 'levenshtein-consensus' } = req.body ?? {};

    if (algorithm !== 'levenshtein-consensus' && algorithm !== 'needleman-wunsch') {
      res.status(400).json({ message: 'Unsupported recovery algorithm.' });
      return;
    }

    if (!validStrands(erroneousStrands) || !validStrands(originalStrands, true)) {
      res
        .status(400)
        .json({ message: "Provide up to 60 uniquely identified DNA strands, with 1-7 reads of at most 8 bases each and four-base originals." });
      return;
    }

    const result = this.simulationService.recoverStrands(
      erroneousStrands,
      originalStrands,
      algorithm,
    );
    res.json(result);
  };
}
