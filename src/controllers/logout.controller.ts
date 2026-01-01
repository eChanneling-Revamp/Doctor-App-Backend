import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

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

    return res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
