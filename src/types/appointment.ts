// src/types/appointment.ts

export type AppointmentType = "CONSULTATION" | "FOLLOW_UP" | "OTHER";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  caseId?: string;
  patientName: string;
  phone: string;
  email?: string;
  appointmentType: AppointmentType;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  notes?: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    full_name: string;
    email: string;
  };
  case?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  caseId?: string;
  patientName: string;
  phone: string;
  email?: string;
  appointmentType: AppointmentType;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  assignedToId?: string;
}

export interface UpdateAppointmentData {
  caseId?: string;
  patientName?: string;
  phone?: string;
  email?: string;
  appointmentType?: AppointmentType;
  appointmentDate?: string;
  appointmentTime?: string;
  status?: AppointmentStatus;
  notes?: string;
  assignedToId?: string;
}
