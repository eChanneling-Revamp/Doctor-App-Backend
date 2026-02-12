import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { generateOTP } from "../utils/otp";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// REGISTER
export const register = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    contactNumber,
    password,
    medicalSpec,
    hospital,
    slmcNumber,
    role
  } = req.body;

  const exists = await prisma.users.findFirst({
    where: { OR: [{ email }, { contactNumber }] }
  });

  if (exists) {
    throw new ApiError(400, "User with this email or contact number already exists");
  }

  const hashed = await hashPassword(password);

  const newUser = await prisma.users.create({
    data: {
      id: uuidv4(),
      name,
      email,
      contactNumber,
      password: hashed,
      medicalSpecs: medicalSpec,
      hospital,
      slmcNumber: slmcNumber ? Number(slmcNumber) : undefined,
      role: role || "PATIENT",
      isActive: true, // Default to true, or use OTP flow to activate
      isEmailVerified: false,
      updatedAt: new Date(),
    }
  });

  const otp = generateOTP();

  await prisma.otps.create({
    data: {
      id: uuidv4(),
      code: otp,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
  });

  console.log("SIGNUP OTP:", otp);

  res.status(201).json({ message: "Registered successfully. OTP sent.", userId: newUser.id });
});

// LOGIN
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken({ id: user.id, role: user.role });

  // Exclude password
  const { password: _, ...userWithoutPassword } = user;

  res.json({ token, user: userWithoutPassword });
});

// FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { emailOrPhone } = req.body;

  const user = await prisma.users.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { contactNumber: emailOrPhone }]
    }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOTP();

  await prisma.otps.create({
    data: {
      id: uuidv4(),
      code: otp,
      userId: user.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
  });

  console.log("RESET OTP:", otp);

  res.json({ message: "OTP sent" });
});

// VERIFY OTP
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { emailOrPhone, code } = req.body;

  const user = await prisma.users.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { contactNumber: emailOrPhone }]
    }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = await prisma.otps.findFirst({
    where: {
      userId: user.id,
      code,
      used: false
    }
  });

  if (!otp || otp.expiresAt < new Date()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  await prisma.otps.update({
    where: { id: otp.id },
    data: { used: true }
  });

  // Also verify email if this was a registration OTP
  if (!user.isEmailVerified) {
      await prisma.users.update({
          where: { id: user.id },
          data: {
            isEmailVerified: true,
            updatedAt: new Date()
          }
      });
  }

  res.json({ message: "OTP verified" });
});

// RESET PASSWORD
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { emailOrPhone, newPassword } = req.body;

  const user = await prisma.users.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { contactNumber: emailOrPhone }]
    }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const hashed = await hashPassword(newPassword);

  await prisma.users.update({
    where: { id: user.id },
    data: {
        password: hashed,
        updatedAt: new Date()
    }
  });

  res.json({ message: "Password reset successful" });
});

// LOGOUT
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(400, "Token missing");
  }

  const token = authHeader.split(" ")[1];

  const decoded: any = jwt.decode(token);
  if (!decoded?.exp) {
    throw new ApiError(400, "Invalid token");
  }

  await prisma.blacklisted_tokens.create({
    data: {
      id: uuidv4(),
      token,
      expiresAt: new Date(decoded.exp * 1000)
    }
  });

  res.json({ message: "Logged out successfully" });
});
