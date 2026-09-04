import { Request, Response } from "express";

export class HealthController {
  getHealth(_req: Request, res: Response): void {
    res.json({ ok: true, service: "dna-backend" });
  }
}
