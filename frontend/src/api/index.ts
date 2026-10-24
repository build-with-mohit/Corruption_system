const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (includeAuth) {
    const token = localStorage.getItem("access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "citizen" | "admin";
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authApi = {
  register: async (data: {
    email: string;
    full_name: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(res);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  me: async (): Promise<User> => {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse<User>(res);
  },
};

// ─── Complaints ──────────────────────────────────────────────────────────────

export interface EvidenceFile {
  id: string;
  original_filename: string;
  stored_filename: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface Complaint {
  id: string;
  complaint_id: string;
  category: string;
  department: string;
  incident_location: string;
  incident_date: string;
  description: string;
  status: "pending" | "under_investigation" | "resolved" | "rejected";
  investigation_notes?: string;
  created_at: string;
  updated_at: string;
  citizen?: User;
  assigned_officer?: { id: string; full_name: string; email: string };
  evidence_files: EvidenceFile[];
}

export interface CitizenStats {
  total: number;
  pending: number;
  under_investigation: number;
  resolved: number;
}

export interface AdminStats {
  total: number;
  pending: number;
  under_investigation: number;
  resolved: number;
  total_change: number;
  pending_change: number;
  under_investigation_change: number;
  resolved_change: number;
}

export interface Analytics {
  stats: AdminStats;
  category_distribution: { category: string; count: number; percentage: number }[];
  department_stats: { department: string; count: number }[];
}

export const complaintsApi = {
  create: async (formData: FormData): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/api/complaints/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse<Complaint>(res);
  },

  getMy: async (): Promise<Complaint[]> => {
    const res = await fetch(`${API_BASE}/api/complaints/my`, {
      headers: getHeaders(),
    });
    return handleResponse<Complaint[]>(res);
  },

  getMyStats: async (): Promise<CitizenStats> => {
    const res = await fetch(`${API_BASE}/api/complaints/my/stats`, {
      headers: getHeaders(),
    });
    return handleResponse<CitizenStats>(res);
  },

  getMyDetail: async (complaintId: string): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/api/complaints/my/${complaintId}`, {
      headers: getHeaders(),
    });
    return handleResponse<Complaint>(res);
  },

  adminGetAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
  }): Promise<{ total: number; items: Complaint[] }> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.status) q.set("status", params.status);
    if (params.category) q.set("category", params.category);
    const res = await fetch(`${API_BASE}/api/complaints/admin/all?${q}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  adminGetDetail: async (complaintId: string): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/api/complaints/admin/${complaintId}`, {
      headers: getHeaders(),
    });
    return handleResponse<Complaint>(res);
  },

  adminUpdate: async (
    complaintId: string,
    data: { status?: string; assigned_officer_id?: string; investigation_notes?: string }
  ): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/api/complaints/admin/${complaintId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Complaint>(res);
  },

  adminAnalytics: async (): Promise<Analytics> => {
    const res = await fetch(`${API_BASE}/api/complaints/admin/analytics`, {
      headers: getHeaders(),
    });
    return handleResponse<Analytics>(res);
  },

  getEvidenceUrl: (complaintUuid: string, storedFilename: string, isAdmin = true): string => {
    const role = isAdmin ? "admin" : "citizen";
    return `${API_BASE}/api/complaints/${role}/evidence/${complaintUuid}/${storedFilename}`;
  },
};

export const usersApi = {
  listOfficers: async (): Promise<{ id: string; full_name: string; email: string }[]> => {
    const res = await fetch(`${API_BASE}/api/users/officers`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
