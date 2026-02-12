import { Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";

// Get all notifications for the logged-in user
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  res.json(notifications);
});

// Mark a notification as read
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  const notification = await prisma.notification.findFirst({
    where: { id: Number(id), userId }
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  const updated = await prisma.notification.update({
    where: { id: Number(id) },
    data: { isRead: true }
  });

  res.json(updated);
});

// Create a notification (can be used by other modules or admin)
export const createNotificationHandler = asyncHandler(async (req: Request, res: Response) => {
    const { userId, title, message } = req.body;

    // Simple validation
    if (!userId || !title || !message) {
        throw new ApiError(400, "userId, title, and message are required");
    }

    const notification = await prisma.notification.create({
        data: {
            userId: Number(userId),
            title,
            message
        }
    });

    // Real-time hook (placeholder)
    // if (global.io) {
    //   global.io.to(`user-${userId}`).emit("new_notification", notification);
    // }

    res.status(201).json(notification);
});

// Internal function to create notification
export const createNotification = async (userId: number, title: string, message: string) => {
  const notification = await prisma.notification.create({
    data: { userId, title, message }
  });
  return notification;
};
