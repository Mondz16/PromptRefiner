import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail, emailVerificationContent , passwordResetContent} from "../utils/email.js";

const JWT_SECRET = () => process.env.JWT_SECRET || "dev-secret";
const CLIENT_ORIGIN = () =>
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

function signToken(payload, expiresIn) {
  return jwt.sign(payload, JWT_SECRET(), { expiresIn });
}

function createAuthToken(user) {
  return signToken({ userId: user._id.toString(), email: user.email }, "1h");
}

function createVerificationToken(user) {
  return signToken({ userId: user._id.toString(), type: "verify" }, "1d");
}

function createPasswordResetToken(user) {
  return signToken({ userId: user._id.toString(), type: "reset" }, "1h");
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
    });

    const verificationToken = createVerificationToken(user);
    const verificationUrl = `${CLIENT_ORIGIN()}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      content: emailVerificationContent({ username: user.email.split("@")[0], url: verificationUrl }),
    });

    return res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to register user" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message:
          "Your account is not verified. Please check your email and verify your account before logging in.",
      });
    }

    const token = createAuthToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        tokenBalance: user.tokenBalance,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to login" });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    const payload = jwt.verify(token, JWT_SECRET());

    if (payload.type !== "verify") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: "Invalid or expired verification token" });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({
        message: "If an account exists, a reset email has been sent.",
      });
    }

    const resetToken = createPasswordResetToken(user);
    const resetUrl = `${CLIENT_ORIGIN()}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      content: passwordResetContent({ username: user.email.split("@")[0], url: resetUrl }),
    });

    return res.json({
      message: "If an account exists, a reset email has been sent.",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to initiate password reset" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const payload = jwt.verify(token, JWT_SECRET());

    if (payload.type !== "reset") {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }
}
