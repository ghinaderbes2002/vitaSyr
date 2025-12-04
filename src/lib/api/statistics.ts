// src/lib/api/statistics.ts

import { casesApi } from "./cases";
import { servicesApi } from "./services";
import { productsApi } from "./products";
import { contactApi } from "./contact";
import { appointmentsApi } from "./appointments";
import { jobsApi } from "./jobs";
import { partnershipsApi } from "./partnerships";
import { blogPostsApi } from "./blog";
import { successStoriesApi } from "./successStories";

export interface DashboardStatistics {
  totalCases: number;
  totalServices: number;
  totalProducts: number;
  totalMessages: number;
  totalAppointments: number;
  totalJobApplications: number;
  totalPartnershipInquiries: number;
  totalBlogPosts: number;
  totalSuccessStories: number;
  pendingCases: number;
  pendingAppointments: number;
}

export const statisticsApi = {
  // Get dashboard statistics by fetching all data and counting
  getDashboardStats: async (): Promise<DashboardStatistics> => {
    try {
      // Fetch all data in parallel
      const [
        cases,
        services,
        products,
        messages,
        appointments,
        jobApplications,
        partnerships,
        blogPosts,
        successStories,
      ] = await Promise.all([
        casesApi.getAll().catch(() => []),
        servicesApi.getAll().catch(() => []),
        productsApi.getAll().catch(() => []),
        contactApi.getAll().catch(() => []),
        appointmentsApi.getAll().catch(() => []),
        jobsApi.getAll().catch(() => []),
        partnershipsApi.getAll().catch(() => []),
        blogPostsApi.getAll().catch(() => []),
        successStoriesApi.getAll().catch(() => []),
      ]);

      // Count pending cases (NEW or UNDER_REVIEW status)
      const pendingCases = cases.filter(
        (c) => c.status === "NEW" || c.status === "UNDER_REVIEW"
      ).length;

      // Count pending appointments (PENDING status)
      const pendingAppointments = appointments.filter(
        (a) => a.status === "PENDING"
      ).length;

      return {
        totalCases: cases.length,
        totalServices: services.length,
        totalProducts: products.length,
        totalMessages: messages.length,
        totalAppointments: appointments.length,
        totalJobApplications: jobApplications.length,
        totalPartnershipInquiries: partnerships.length,
        totalBlogPosts: blogPosts.length,
        totalSuccessStories: successStories.length,
        pendingCases,
        pendingAppointments,
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      // Return zeros if something fails
      return {
        totalCases: 0,
        totalServices: 0,
        totalProducts: 0,
        totalMessages: 0,
        totalAppointments: 0,
        totalJobApplications: 0,
        totalPartnershipInquiries: 0,
        totalBlogPosts: 0,
        totalSuccessStories: 0,
        pendingCases: 0,
        pendingAppointments: 0,
      };
    }
  },
};
