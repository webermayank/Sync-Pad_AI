import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface AuthPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  [key: string]: unknown;
}

export const register = async ({ email, password }: AuthPayload): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
  });
  return response.data;
};

export const login = async ({ email, password }: AuthPayload): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const getToken = (): string | null => {
  return localStorage.getItem("syncpad_token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("syncpad_token", token);
};

export const logout = (): void => {
  localStorage.removeItem("syncpad_token");
};