import nodemailer from "nodemailer";
import prisma from "../config/prisma";
import { NotificationType } from "@prisma/client";
import { randomUUID } from "crypto";

// Configure Nodemailer
// In a real app, these would be environment variables.
// For testing/dev, we can use Ethereal or a dummy transport if vars aren't set.
const transporter = nodemailer.createTransport({
  service: "gmail", // or use host/port
  auth: {
    user: process.env.EMAIL_USER || "test@example.com",
    pass: process.env.EMAIL_PASS || "password",
  },
});

export const NotificationService = {
  /**
   * Send an email and log it.
   */
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    type: string, // Using string to match notification_logs schema
    appointmentId?: string,
    metadata?: any
  ) {
    console.log(`[NotificationService] Sending ${type} email to ${to}`);

    let status = "PENDING";
    let failureReason = null;
    let messageId = null;

    try {
      // Attempt to send email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER || "noreply@doctorapp.com",
        to,
        subject,
        html,
      });

      status = "SENT";
      messageId = info.messageId;
      console.log(`[NotificationService] Email sent: ${info.messageId}`);

    } catch (error: any) {
      console.error(`[NotificationService] Email failed:`, error);
      status = "FAILED";
      failureReason = error.message;
    }

    // Log to database
    try {
        await prisma.notification_logs.create({
            data: {
                id: randomUUID(),
                notificationId: messageId || `ERR-${randomUUID()}`, // Use messageId or generate one if failed
                type,
                method: "EMAIL",
                recipient: to,
                status,
                appointmentId: appointmentId || null,
                failureReason,
                templateData: metadata || {},
                sentAt: status === "SENT" ? new Date() : null,
                priority: "high"
            }
        });
    } catch (logError) {
        console.error("[NotificationService] Failed to log notification:", logError);
    }

    return status === "SENT";
  },

  async sendOTP(email: string, otp: string) {
    const subject = "Your OTP Code";
    const html = `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`;
    return this.sendEmail(email, subject, html, "OTP");
  },

  async sendAppointmentConfirmation(email: string, appointmentDetails: any) {
    const subject = "Appointment Confirmed";
    const html = `
      <h1>Appointment Confirmed</h1>
      <p>Dear ${appointmentDetails.patientName},</p>
      <p>Your appointment with Dr. ${appointmentDetails.doctorName} has been confirmed.</p>
      <p><strong>Date:</strong> ${new Date(appointmentDetails.date).toLocaleString()}</p>
      <p><strong>Reference:</strong> ${appointmentDetails.appointmentNumber}</p>
    `;
    return this.sendEmail(email, subject, html, "APPOINTMENT_CONFIRMED", appointmentDetails.id, appointmentDetails);
  },

  async sendAppointmentReminder(email: string, appointmentDetails: any) {
    const subject = "Appointment Reminder";
    const html = `
      <h1>Appointment Reminder</h1>
      <p>Dear ${appointmentDetails.patientName},</p>
      <p>This is a reminder for your appointment with Dr. ${appointmentDetails.doctorName} tomorrow.</p>
      <p><strong>Date:</strong> ${new Date(appointmentDetails.date).toLocaleString()}</p>
    `;
    return this.sendEmail(email, subject, html, "REMINDER", appointmentDetails.id, appointmentDetails);
  }
};
