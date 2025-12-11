// src/lib/api/publicClient.ts
// API Client for public pages (without authentication)

import axios from "axios";

const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApiClient;
