// src/hooks/useSiteStats.ts

"use client";

import { useState, useEffect } from "react";

export interface SiteStats {
  happyPatients: number;
  yearsExperience: number;
  sponsorshipCases: number;
  successRate: number;
}

const DEFAULT_STATS: SiteStats = {
  happyPatients: 500,
  yearsExperience: 15,
  sponsorshipCases: 200,
  successRate: 98,
};

export function useSiteStats() {
  const [stats, setStats] = useState<SiteStats>(DEFAULT_STATS);

  useEffect(() => {
    try {
      const savedStats = localStorage.getItem("siteStats");
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, []);

  return stats;
}
