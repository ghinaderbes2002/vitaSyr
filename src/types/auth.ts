export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "STAFF" | "OTHER";
  phone?: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
}

export interface ApiError {
  message: string;
}
