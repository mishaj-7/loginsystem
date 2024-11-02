import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {  // Retain or modify this to match your needs
      type: String,
      required: true,
    },
    email: {  // Add this line
      type: String,
      required: true,
      unique: true,  // Ensures that no two users can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
