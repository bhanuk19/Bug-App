// Require Mongoose
import { Schema as _Schema, model } from "mongoose";

// Define Reported Schema
const Schema = _Schema;

const apiKey = new Schema(
  {
    application: {
      type: String,
    },
    key: {
      type: String,
    },
  },
  { collection: "ApiKeys", timestamps: true }
);

export default new model("ApiKeys", apiKey);
