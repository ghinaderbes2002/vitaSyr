// src/types/partner.ts

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerData {
  name: string;
  website?: string;
  isActive?: boolean;
}
