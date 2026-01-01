import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { generateOTP } from "../utils/otp";

// REGISTER
export const register = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    phone,
    password,
    medicalSpec,
    hospital,
    slmcNumber
  } = req.body;

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] }
  });

  if (exists)
    return res.status(400).json({ message: "User already exists" });

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      password: hashed,
      medicalSpec,
      hospital,
      slmcNumber
    }
  });

  const otp = generateOTP();

  await prisma.oTP.create({
    data: {
      code: otp,
      userId: user.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
  });

  console.log("SIGNUP OTP:", otp);

  res.json({ message: "Registered successfully. OTP sent." });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken({ id: user.id });

  res.json({ token, user });
};

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  const { emailOrPhone } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    }
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();

  await prisma.oTP.create({
    data: {
      code: otp,
      userId: user.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
  });

  console.log("RESET OTP:", otp);

  res.json({ message: "OTP sent" });
};

// VERIFY OTP
export const verifyOTP = async (req: Request, res: Response) => {
  const { emailOrPhone, code } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    }
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      code,
      used: false
    }
  });

  if (!otp || otp.expiresAt < new Date())
    return res.status(400).json({ message: "Invalid OTP" });

  await prisma.oTP.update({
    where: { id: otp.id },
    data: { used: true }
  });

  res.json({ message: "OTP verified" });
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  const { emailOrPhone, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    }
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed }
  });

  res.json({ message: "Password reset successful" });
};


import jwt from "jsonwebtoken";

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.decode(token);
    if (!decoded?.exp) {
      return res.status(400).json({ message: "Invalid token" });
    }

    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: new Date(decoded.exp * 1000)
      }
    });

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
