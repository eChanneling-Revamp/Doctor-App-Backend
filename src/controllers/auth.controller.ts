import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { generateOTP } from "../utils/otp";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      contactNumber,
      password,
      medicalSpecs,
      hospital,
      slmcNumber
    } = req.body;

    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { contactNumber }]
      }
    });

    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        contactNumber,
        password: hashed,
        medicalSpecs,
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

  } catch (error) {
    res.status(500).json({ message: "Register failed", error });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const valid = await comparePassword(password, user.password);

    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user.id });

    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { emailOrPhone } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { contactNumber: emailOrPhone }
        ]
      }
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

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

  } catch (error) {
    res.status(500).json({ message: "Forgot password failed" });
  }
};

// VERIFY OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { emailOrPhone, code } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { contactNumber: emailOrPhone }
        ]
      }
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

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

  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { emailOrPhone, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { contactNumber: emailOrPhone }
        ]
      }
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed }
    });

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Reset password failed" });
  }
};

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(400).json({ message: "Token missing" });

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.decode(token);

    if (!decoded?.exp)
      return res.status(400).json({ message: "Invalid token" });

    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: new Date(decoded.exp * 1000)
      }
    });

    res.json({ message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};
