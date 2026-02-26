import prisma from "../config/prisma";
import { NotificationService } from "./notification.service";
import { AppointmentStatus } from "@prisma/client";

export const ReminderService = {
  async processReminders() {
    console.log("[ReminderService] Processing reminders...");

    // 1. Calculate time range (e.g., appointments for tomorrow)
    const now = new Date();
    const tomorrowStart = new Date(now);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    console.log(`[ReminderService] Checking for appointments between ${tomorrowStart.toISOString()} and ${tomorrowEnd.toISOString()}`);

    // 2. Find confirmed appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.CONFIRMED,
        session: {
          scheduledAt: {
            gte: tomorrowStart,
            lte: tomorrowEnd,
          },
        },
      },
      include: {
        patient: true,
        doctor: true,
        session: true,
      },
    });

    console.log(`[ReminderService] Found ${appointments.length} appointments.`);

    let sentCount = 0;

    for (const appt of appointments) {
      // 3. Check if already reminded
      const existingLog = await prisma.notification_logs.findFirst({
        where: {
          appointmentId: appt.id,
          type: "REMINDER",
          status: "SENT",
        },
      });

      if (existingLog) {
        console.log(`[ReminderService] Reminder already sent for ${appt.id}`);
        continue;
      }

      // 4. Send Reminder
      if (appt.patientEmail) {
        const success = await NotificationService.sendAppointmentReminder(appt.patientEmail, {
            ...appt,
            doctorName: appt.doctor.name,
            date: appt.session.scheduledAt,
            // time: appt.session.startTime // Session might handle time differently, but scheduledAt is good enough for now
        });

        if (success) sentCount++;
      } else {
        console.warn(`[ReminderService] No email for appointment ${appt.id}`);
      }
    }

    console.log(`[ReminderService] Sent ${sentCount} reminders.`);
    return sentCount;
  },
};
