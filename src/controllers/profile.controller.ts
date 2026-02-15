import { Request, Response } from "express";
import prisma from "../config/prisma";
import { comparePassword, hashPassword } from "../utils/hash";

// ---------------- GET PROFILE ----------------
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
          contactNumber: true,
        medicalSpecs: true,
        hospital: true,
        slmcNumber: true,
        profileImage: true,
        biometric: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // return 'name' directly instead of fullName
  } catch (error: any) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// ---------------- UPDATE PROFILE ----------------
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, email, contactNumber, medicalSpecs, hospital, slmcNumber, profileImage } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
         ...(contactNumber !== undefined && { contactNumber }),
        ...(medicalSpecs !== undefined && { medicalSpecs }),
        ...(hospital !== undefined && { hospital }),
        ...(slmcNumber !== undefined && { slmcNumber }),
        ...(profileImage !== undefined && { profileImage }),
      },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// ---------------- CHANGE PASSWORD ----------------
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: "Current password incorrect" });

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error: any) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

// ---------------- TOGGLE BIOMETRIC LOGIN ----------------
export const toggleBiometric = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { enabled } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { biometric: enabled },
    });

    res.json({ message: "Biometric setting updated" });
  } catch (error: any) {
    console.error("Toggle Biometric Error:", error);
    res.status(500).json({ message: "Failed to update biometric setting", error: error.message });
  }
};
