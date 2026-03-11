import User from "../models/User.js";
import TokenTransaction from "../models/TokenTransaction.js";

export async function getBalance(req, res) {
  try {
    const user = await User.findById(req.user._id).select("tokenBalance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ tokenBalance: user.tokenBalance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch token balance" });
  }
}

export async function purchaseTokens(req, res) {
  try {
    const numericAmount = Number(req.body.amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: "Invalid token amount" });
    }

    req.user.tokenBalance += numericAmount;
    await req.user.save();

    await TokenTransaction.create({
      userId: req.user._id,
      amount: numericAmount,
      type: "purchase",
    });

    return res.json({
      message: "Tokens added successfully (mock purchase).",
      tokenBalance: req.user.tokenBalance,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to purchase tokens" });
  }
}
