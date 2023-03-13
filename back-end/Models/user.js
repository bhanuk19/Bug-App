import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    dob: { type: Date, required: true },
    admin: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
  },
  { collection: "Users", timestamps: true }
);

export default new model("User", User);
