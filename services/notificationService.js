import { sendEmail } from "../utils/emailHelper.js";

export const notifyPatientCancellation = async (patientEmail, appointmentId) => {
  const subject = `Your Appointment #${appointmentId} has been canceled`;
  const message = `Dear Patient,\n\nYour appointment (ID: ${appointmentId}) has been canceled.\n\nThank you.`;
  await sendEmail(patientEmail, subject, message);
};
