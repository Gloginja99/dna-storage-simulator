import { Schema, model, Document, Types } from "mongoose";
import { DnaBase, ErrorType, SimulationConfig } from "./simulation.models";

interface SavedDnaStrand {
  id: string;
  charIndex: number;
  originalChar: string;
  bases: DnaBase[];
  originalBases: DnaBase[];
  hasError: boolean;
  errorTypes: ErrorType[];
}

export interface SavedSimulationDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  inputText: string;
  config: SimulationConfig;
  encodedStrands: SavedDnaStrand[];
  erroneousStrands: SavedDnaStrand[];
  erroneousText: string;
  recoveredText: string;
  corrections: number;
  successRate: number;
  createdAt: Date;
}

const strandSchema = new Schema<SavedDnaStrand>(
  {
    id: String,
    charIndex: Number,
    originalChar: String,
    bases: [String],
    originalBases: [String],
    hasError: Boolean,
    errorTypes: [String],
  },
  { _id: false },
);

const savedSimulationSchema = new Schema<SavedSimulationDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  inputText: { type: String, required: true },
  config: { type: Schema.Types.Mixed, required: true },
  encodedStrands: { type: [strandSchema], default: [] },
  erroneousStrands: { type: [strandSchema], default: [] },
  erroneousText: { type: String, default: "" },
  recoveredText: { type: String, default: "" },
  corrections: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const SavedSimulationModel = model<SavedSimulationDocument>(
  "SavedSimulation",
  savedSimulationSchema,
);
