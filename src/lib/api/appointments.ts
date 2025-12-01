// src/lib/api/appointments.ts

import apiClient from "./client";
import type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "@/types/appointment";

export const appointmentsApi = {
  // Get all appointments
  getAll: async (): Promise<Appointment[]> => {
    const { data } = await apiClient.get<Appointment[]>("/appointments");
    return data;
  },

  // Get single appointment
  getOne: async (id: string): Promise<Appointment> => {
    const { data } = await apiClient.get<Appointment>(`/appointments/${id}`);
    return data;
  },

  // Create appointment
  create: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    const { data } = await apiClient.post<Appointment>("/appointments", appointmentData);
    return data;
  },

  // Update appointment
  update: async (id: string, updates: UpdateAppointmentData): Promise<Appointment> => {
    const { data } = await apiClient.put<Appointment>(`/appointments/${id}`, updates);
    return data;
  },

  // Delete appointment
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
  },
};
