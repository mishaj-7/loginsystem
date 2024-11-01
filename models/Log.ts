// models/Log.ts
import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      required: true,
      enum: ["login", "create", "update", "delete"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Log || mongoose.model("Log", logSchema);
