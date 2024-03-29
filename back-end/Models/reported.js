// Require Mongoose
import { Schema as _Schema, model } from "mongoose";

// Define Reported Schema
const Schema = _Schema;

const Reported = new Schema(
  {
    ticketID: {
      type: String,
      required: true,
    },
    bugName: { type: String, required: true },
    bugURL: String,
    bugDescription: String,
    comments: { type: String, default: "None" },
    priority: { type: String, default: "Low" },
    status: {
      type: String,
      default: "reported",
      required: true,
    },
    reportedBy: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      default: "",
    },
    fixedBy: {
      type: String,
      default: "",
    },
    bugImages: {
      type: Array,
      default: null,
      required: true,
    },
  },
  { collection: "Reported", timestamps: true }
);

export default new model("Reported", Reported);
