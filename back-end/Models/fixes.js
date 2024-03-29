// Require Mongoose
import { Schema as _Schema, model } from "mongoose";

// Define Reported Schema
const Schema = _Schema;

const Fixes = new Schema(
  {
    fixID: {
      type: String,
      required: true,
    },
    bugID: { type: String, required: true },
    fixAddedBy: { type: String, required: true },
    fixURL: { type: String, required: true },
    fixDescription: { type: String, required: true },
    status: { type: String, default: "Pending", required: true },
  },
  { collection: "Fixes", timestamps: true }
);

export default new model("Fixes", Fixes);
