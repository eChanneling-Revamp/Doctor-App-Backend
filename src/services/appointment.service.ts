import prisma from "../config/prisma";


// BOOK APPOINTMENT
export const bookAppointmentService = async (data: any) => {
  const {
    doctorId,
    patientId,
    sessionId,
    patientName,
    patientEmail,
    patientPhone,
    consultationFee,
    totalAmount
  } = data;

  const appointment = await prisma.appointment.create({
    data: {
      appointmentNumber: "APT-" + Date.now(),
      doctorId,
      patientId,
      sessionId,
      patientName,
      patientEmail,
      patientPhone,
      consultationFee,
      totalAmount
    }
  });

  return appointment;
};
export const createAppointmentService = async (data: any) => {

  const {
    doctorId,
    patientId,
    sessionId,
    patientName,
    patientEmail,
    patientPhone,
    consultationFee,
    totalAmount
  } = data;

  const appointment = await prisma.appointment.create({
    data: {
      appointmentNumber: "APT-" + Date.now(),
      doctorId,
      patientId,
      sessionId,
      patientName,
      patientEmail,
      patientPhone,
      consultationFee,
      totalAmount
    }
  });

  return appointment;
};

export const getAppointmentsService = async () => {
  return prisma.appointment.findMany({
    include: {
      doctor: true,
      patient: true,
      session: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const getCurrentAppointmentsService = async () => {
  return prisma.appointment.findMany({
    where: {
      status: "CONFIRMED"
    },
    include: {
      doctor: true,
      patient: true,
      session: true
    }
  });
};
export const getUpcomingAppointmentsService = async () => {
  return prisma.appointment.findMany({
    where: {
      status: "CONFIRMED"
    },
    include: {
      doctor: true,
      patient: true,
      session: true
    }
  });
};
export const getPastAppointmentsService = async () => {
  return prisma.appointment.findMany({
    where: {
      status: "COMPLETED"
    },
    include: {
      doctor: true,
      patient: true,
      session: true
    }
  });
};