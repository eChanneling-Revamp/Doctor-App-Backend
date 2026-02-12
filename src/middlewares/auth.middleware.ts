import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import ApiError from "../utils/ApiError";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    const blacklisted = await prisma.blacklisted_tokens.findUnique({
      where: { token }
    });

    if (blacklisted) {
      throw new ApiError(401, "Token expired");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      (req as any).user = decoded; // Contains id (string) and role
      next();
    } catch (error) {
       throw new ApiError(401, "Invalid token");
    }

  } catch (error) {
    next(error);
  }
};
