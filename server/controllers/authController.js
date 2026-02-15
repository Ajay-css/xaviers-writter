import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../config/mailer.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    await sendWelcomeEmail(email, name);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Incoming Email:", email);
  console.log("Incoming Password:", password);

  const user = await User.findOne({ email });
  console.log("User Found:", user);

  if (!user)
    return res.json({ success: false, message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  console.log("Password Match:", match);

  if (!match)
    return res.json({ success: false, message: "Wrong password" });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ success: true, token });
};