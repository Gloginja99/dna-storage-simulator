import { Types } from "mongoose";
import { SavedSimulationModel } from "../models/saved-simulation.model";
import {
  SaveSimulationRequestBody,
  SavedSimulationDetail,
  SavedSimulationSummary,
} from "../types/auth.api";

export class HistoryError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export class HistoryService {
  async save(
    userId: string,
    body: SaveSimulationRequestBody,
  ): Promise<SavedSimulationSummary> {
    const name = body.name?.trim();
    if (!name) {
      throw new HistoryError("name is required", 400);
    }

    const doc = await SavedSimulationModel.create({
      userId: new Types.ObjectId(userId),
      name,
      inputText: body.inputText,
      config: body.config,
      encodedStrands: body.encodedStrands,
      erroneousStrands: body.erroneousStrands,
      erroneousText: body.erroneousText,
      recoveredText: body.recoveredText,
      corrections: body.corrections,
      successRate: body.successRate,
    });

    return this.toSummary(doc);
  }

  async list(userId: string): Promise<SavedSimulationSummary[]> {
    const docs = await SavedSimulationModel.find({
      userId: new Types.ObjectId(userId),
    }).sort({
      createdAt: -1,
    });
    return docs.map((doc) => this.toSummary(doc));
  }

  async getById(userId: string, id: string): Promise<SavedSimulationDetail> {
    const doc = await SavedSimulationModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!doc) {
      throw new HistoryError("Simulation not found", 404);
    }

    return {
      ...this.toSummary(doc),
      config: doc.config,
      encodedStrands: doc.encodedStrands,
      erroneousStrands: doc.erroneousStrands,
      erroneousText: doc.erroneousText,
      recoveredText: doc.recoveredText,
      corrections: doc.corrections,
    };
  }

  async remove(userId: string, id: string): Promise<void> {
    const result = await SavedSimulationModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new HistoryError("Simulation not found", 404);
    }
  }

  private toSummary(doc: {
    _id: Types.ObjectId;
    name: string;
    inputText: string;
    createdAt: Date;
    successRate: number;
  }): SavedSimulationSummary {
    return {
      id: doc._id.toString(),
      name: doc.name,
      inputText: doc.inputText,
      createdAt: doc.createdAt.toISOString(),
      successRate: doc.successRate,
    };
  }
}
