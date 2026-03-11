import mongoose from "mongoose";

const tokenTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["conversion", "purchase", "manual_adjustment"],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export default mongoose.model("TokenTransaction", tokenTransactionSchema);
