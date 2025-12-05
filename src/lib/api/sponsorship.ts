import apiClient from "./client";
import type {
  SponsorshipCase,
  SponsorshipDonation,
  CreateDonationDTO,
} from "@/types/sponsorship";

// Sponsorship Cases API


export const sponsorshipCasesApi = {
  // Get all cases
  getAll: async (): Promise<SponsorshipCase[]> => {
    const { data } = await apiClient.get("/sponsorship/sponsorship-cases");
    return data;
  },

  // Get single case
  getById: async (id: string): Promise<SponsorshipCase> => {
    const { data } = await apiClient.get(
      `/sponsorship/sponsorship-cases/${id}`
    );
    return data;
  },

  // Create case (Admin)
  create: async (formData: FormData): Promise<SponsorshipCase> => {
    const { data } = await apiClient.post(
      "/sponsorship/sponsorship-cases",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Update case (Admin)
  update: async (id: string, formData: FormData): Promise<SponsorshipCase> => {
    const { data } = await apiClient.put(
      `/sponsorship/sponsorship-cases/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Delete case (Admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sponsorship/sponsorship-cases/${id}`);
  },
};

// =======================
// Donations API
// =======================

export const sponsorshipDonationsApi = {
  // Create donation (Public)
  create: async (
    caseId: string,
    data: CreateDonationDTO
  ): Promise<SponsorshipDonation> => {
    const { data: res } = await apiClient.post(
      `/sponsorship/sponsorship-cases/${caseId}/donations`,
      data
    );
    return res;
  },

  
  

  // Get donations for a case (Admin)
  getByCaseId: async (caseId: string): Promise<SponsorshipDonation[]> => {
    const { data } = await apiClient.get(
      `/sponsorship/sponsorship-cases/${caseId}/donations`
    );
    return data;
  },

  // Update donation payment status (Admin)
  updateStatus: async (
    caseId: string,
    donationId: string,
    paymentStatus: string
  ): Promise<SponsorshipDonation> => {
    const { data } = await apiClient.put(
      `/sponsorship/sponsorship-cases/${caseId}/donations/${donationId}/status`,
      { paymentStatus }
    );
    return data;
  },
};
