// Require Mongoose
import { Schema as _Schema, model } from "mongoose";

// Define Reported Schema
const Schema = _Schema;

const Counter = new Schema(
  {
    reportTicket: {
      type: Number,
    },
    fixTicket: {
      type: Number,
    },
  },
  { collection: "Counter", timestamps: true }
);

export default new model("Counter", Counter);
