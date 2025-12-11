// src/lib/api/publicPartners.ts
// Public API for partners (no authentication required)

import publicApiClient from "./publicClient";
import type { Partner } from "@/types/partner";

export const publicPartnersApi = {
  getAll: async (): Promise<Partner[]> => {
    const { data } = await publicApiClient.get<Partner[]>("/partners");
    return data;
  },
};
