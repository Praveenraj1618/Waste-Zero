// src/services/api.ts
import axios from "axios";

// =========================
// BASE CONFIG (VITE)
// =========================
const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

let authToken: string | null = localStorage.getItem("token");

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Inject token into headers
api.interceptors.request.use((config) => {
  if (authToken) config.headers["x-auth-token"] = authToken;
  return config;
});

// Normalize backend errors
function normalizeError(err: any): string {
  if (err?.response?.data?.msg) return err.response.data.msg;
  if (err?.response?.data?.errors?.length)
    return err.response.data.errors[0].msg;
  return "Something went wrong";
}

// =========================
// AUTH HELPERS
// =========================
export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

// =========================
// TYPES
// =========================
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  skills?: string[];
  bio?: string;
  location?: string;
}

export interface Opportunity {
  _id: string;
  title: string;
  description: string;
  organization: User;
  location?: string;
  duration?: string;
  requiredSkills?: string[];
  imageUrl?: string;
  volunteers?: User[];
  date?: string;
  status?: string;
}

// =========================
// API FUNCTIONS
// =========================

// ---------- AUTH ----------
export async function login(email: string, password: string) {
  try {
    const res = await api.post("/auth/login", { email, password });
    setAuthToken(res.data.token);
    return res.data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function signup(data: any) {
  try {
    return (await api.post("/users", data)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

// ---------- USERS ----------
export async function getUser(id: string) {
  try {
    return (await api.get(`/users/${id}`)).data as User;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function updateUser(id: string, data: any) {
  try {
    return (await api.put(`/users/${id}`, data)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function getUserProfile() {
  try {
    return (await api.get("/users/profile")).data as User;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function updateUserProfile(data: any) {
  try {
    return (await api.put("/users/profile", data)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

// ---------- OPPORTUNITIES ----------
export async function listOpportunities(params?: any) {
  try {
    return (await api.get("/opportunities", { params })).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function getOpportunity(id: string) {
  try {
    return (await api.get(`/opportunities/${id}`)).data as Opportunity;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function createOpportunity(formData: FormData) {
  try {
    return (
      await api.post("/opportunities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function updateOpportunity(id: string, formData: FormData) {
  try {
    return (
      await api.put(`/opportunities/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function deleteOpportunity(id: string) {
  try {
    return (await api.delete(`/opportunities/${id}`)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function joinOpportunity(id: string) {
  try {
    return (await api.put(`/opportunities/${id}/join`)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

// ---------- PICKUPS ----------
export async function schedulePickup(data: any) {
  try {
    return (await api.post("/pickups", data)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function listPickups() {
  try {
    return (await api.get("/pickups")).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function updatePickup(id: string, data: any) {
  try {
    return (await api.put(`/pickups/${id}`, data)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

// ---------- MESSAGES ----------
export async function getConversations() {
  try {
    return (await api.get("/messages/conversations")).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function getConversation(partnerId: string) {
  try {
    return (await api.get(`/messages/${partnerId}`)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function markMessageRead(messageId: string) {
  try {
    return (await api.put(`/messages/${messageId}/read`)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function sendMessageREST(receiver_id: string, content: string) {
  try {
    return (await api.post("/messages", { receiver_id, content })).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

// ---------- NOTIFICATIONS ----------
export async function listNotifications() {
  try {
    return (await api.get("/notifications")).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function markNotificationRead(id: string) {
  try {
    return (await api.put(`/notifications/${id}/read`)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

// ---------- MATCHING ----------
export async function findMatches(params?: any) {
  try {
    return (await api.get("/matching", { params })).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

// ---------- ADMIN ----------
export async function adminListUsers() {
  try {
    return (await api.get("/admin/users")).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function adminSuspendUser(id: string) {
  try {
    return (await api.put(`/admin/users/${id}/suspend`)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function adminDeleteOpportunity(id: string) {
  try {
    return (await api.delete(`/admin/opportunities/${id}`)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function adminGetLogs() {
  try {
    return (await api.get("/admin/logs")).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export const getAdminLogs = adminGetLogs;

// ---------- ANALYTICS ----------
export async function getUserActivity(days = 7) {
  try {
    return (await api.get(`/analytics/user-activity?days=${days}`)).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function getOpportunityEngagement() {
  try {
    return (await api.get("/analytics/opportunity-engagement")).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export async function getAnalytics() {
  try {
    return (await api.get("/analytics/overview")).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

// ---------- REPORTS ----------
export async function getFullReport() {
  try {
    return (await api.get("/reports/full-report")).data;
  } catch (err) {
    throw new Error(normalizeError(err));
  }
}

export default api;
