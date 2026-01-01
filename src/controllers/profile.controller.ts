import { Request, Response } from "express";
import  prisma  from "../config/prisma";
import { comparePassword, hashPassword } from "../utils/hash";

// GET PROFILE
export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      medicalSpec: true,
      hospital: true,
      slmcNumber: true,
      profileImage: true,
      biometric: true
    }
  });

  res.json(user);
};

// UPDATE PROFILE
export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const {
    fullName,
    email,
    phone,
    medicalSpec,
    hospital,
    slmcNumber,
    profileImage
  } = req.body;

  await prisma.user.update({
    where: { id: userId },
    data: {
      fullName,
      email,
      phone,
      medicalSpec,
      hospital,
      slmcNumber,
      profileImage
    }
  });

  res.json({ message: "Profile updated successfully" });
};

// CHANGE PASSWORD (SECURITY)
export const changePassword = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid)
    return res.status(401).json({ message: "Current password incorrect" });

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed }
  });

  res.json({ message: "Password changed successfully" });
};

// TOGGLE BIOMETRIC LOGIN
export const toggleBiometric = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { enabled } = req.body;

  await prisma.user.update({
    where: { id: userId },
    data: { biometric: enabled }
  });

  res.json({ message: "Biometric setting updated" });
};

// UPLOAD IMAGE
export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Construct URL. Assuming server runs on localhost or is configured with a base URL
  // For simplicity, we return the relative path which the frontend can prepend with base URL
  const imageUrl = `/uploads/${req.file.filename}`;

  res.json({ imageUrl });
};
