import { Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";

// Create Reminder
export const createReminder = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, scheduledTime } = req.body;
    const userId = (req as any).user.id;

    if (!title || !scheduledTime) {
        throw new ApiError(400, "Title and scheduledTime are required");
    }

    // Ensure UTC handling - clients should send ISO strings (e.g., 2023-10-27T10:00:00Z)
    const date = new Date(scheduledTime);
    if (isNaN(date.getTime())) {
        throw new ApiError(400, "Invalid date format");
    }

    const reminder = await prisma.reminder.create({
        data: {
            userId,
            title,
            description,
            scheduledTime: date
        }
    });

    res.status(201).json(reminder);
});

// Get Reminders
export const getReminders = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { status } = req.query;

    const where: any = { userId };
    if (status === "completed") where.isCompleted = true;
    if (status === "pending") where.isCompleted = false;

    const reminders = await prisma.reminder.findMany({
        where,
        orderBy: { scheduledTime: "asc" }
    });

    res.json(reminders);
});

// Update Reminder
export const updateReminder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, scheduledTime, isCompleted } = req.body;
    const userId = (req as any).user.id;

    const reminder = await prisma.reminder.findFirst({
        where: { id: Number(id), userId }
    });

    if (!reminder) {
        throw new ApiError(404, "Reminder not found");
    }

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (scheduledTime !== undefined) {
        const date = new Date(scheduledTime);
        if (isNaN(date.getTime())) {
             throw new ApiError(400, "Invalid date format");
        }
        data.scheduledTime = date;
    }
    if (isCompleted !== undefined) data.isCompleted = isCompleted;

    const updated = await prisma.reminder.update({
        where: { id: Number(id) },
        data
    });

    res.json(updated);
});

// Delete Reminder
export const deleteReminder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const reminder = await prisma.reminder.findFirst({
        where: { id: Number(id), userId }
    });

    if (!reminder) {
        throw new ApiError(404, "Reminder not found");
    }

    await prisma.reminder.delete({
        where: { id: Number(id) }
    });

    res.json({ message: "Reminder deleted" });
});
