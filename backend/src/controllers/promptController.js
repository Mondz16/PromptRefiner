import PromptConversionLog from "../models/PromptConversionLog.js";
import TokenTransaction from "../models/TokenTransaction.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { refinePrompt } from "../utils/openai.js";

const FREE_CONVERSION_LIMIT = Number(process.env.FREE_CONVERSION_LIMIT || 5);
const TOKENS_PER_CONVERSION = Number(process.env.TOKENS_PER_CONVERSION || 1);

async function resolveAuthenticatedUser(req, res) {
  if (!req.headers.authorization) return null;

  try {
    await new Promise((resolve, reject) => {
      requireAuth(req, res, (err) => (err ? reject(err) : resolve()));
    });
    return req.user;
  } catch {
    return null;
  }
}

export async function convertPrompt(req, res) {
  try {
    const { prompt, target, tone, format, isDemo } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return res.status(400).json({
        message:
          "Please provide a more detailed prompt (at least 5 characters).",
      });
    }

    const user = await resolveAuthenticatedUser(req, res);

    if (!user) {
      const demoUsage = Number(req.headers["x-demo-usage"] || 0);

      if (demoUsage >= FREE_CONVERSION_LIMIT) {
        return res.status(402).json({
          message:
            "Free demo limit reached. Please create an account and purchase tokens to continue.",
        });
      }

      const refinedPrompt = await refinePrompt(prompt, { target, tone, format });

      await PromptConversionLog.create({
        userId: null,
        inputPrompt: prompt,
        outputPrompt: refinedPrompt,
        tokensUsed: 0,
      });

      return res.json({
        refinedPrompt,
        remainingFree: FREE_CONVERSION_LIMIT - demoUsage - 1,
        tokensDeducted: 0,
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before using the prompt converter.",
      });
    }

    if (!isDemo) {
      if (user.tokenBalance < TOKENS_PER_CONVERSION) {
        return res.status(402).json({
          message:
            "Insufficient tokens. Please purchase more tokens to continue.",
        });
      }

      user.tokenBalance -= TOKENS_PER_CONVERSION;
      await user.save();

      await TokenTransaction.create({
        userId: user._id,
        amount: -TOKENS_PER_CONVERSION,
        type: "conversion",
      });
    }

    const refinedPrompt = await refinePrompt(prompt, { target, tone, format });

    await PromptConversionLog.create({
      userId: user._id,
      inputPrompt: prompt,
      outputPrompt: refinedPrompt,
      tokensUsed: TOKENS_PER_CONVERSION,
    });

    return res.json({
      refinedPrompt,
      remainingFree: null,
      tokensDeducted: TOKENS_PER_CONVERSION,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to convert prompt" });
  }
}
