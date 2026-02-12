import { Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { v4 as uuidv4 } from "uuid";

// Get all notifications for the logged-in user
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const notifications = await prisma.notifications.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  res.json(notifications);
});

// Mark a notification as read
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  const notification = await prisma.notifications.findFirst({
    where: { id, userId }
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  const updated = await prisma.notifications.update({
    where: { id },
    data: {
        isRead: true,
        readAt: new Date()
    }
  });

  res.json(updated);
});

// Create a notification (can be used by other modules or admin)
export const createNotificationHandler = asyncHandler(async (req: Request, res: Response) => {
    const { userId, title, message, type } = req.body;

    // Simple validation
    if (!userId || !title || !message) {
        throw new ApiError(400, "userId, title, and message are required");
    }

    const notification = await prisma.notifications.create({
        data: {
            id: uuidv4(),
            userId,
            title,
            message,
            type: type || "SYSTEM_ALERT"
        }
    });

    res.status(201).json(notification);
});

// Internal function to create notification
export const createNotification = async (userId: string, title: string, message: string, type: any = "SYSTEM_ALERT") => {
  const notification = await prisma.notifications.create({
    data: {
        id: uuidv4(),
        userId,
        title,
        message,
        type
    }
  });
  return notification;
};
