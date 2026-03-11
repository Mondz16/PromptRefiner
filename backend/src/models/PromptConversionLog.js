import mongoose from "mongoose";

const promptConversionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    inputPrompt: {
      type: String,
      required: true,
    },
    outputPrompt: {
      type: String,
      required: true,
    },
    tokensUsed: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export default mongoose.model("PromptConversionLog", promptConversionLogSchema);
