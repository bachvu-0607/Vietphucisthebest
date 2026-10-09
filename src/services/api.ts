import { EventItem, Costume, BackgroundSetting, FittingDraft, AIJob } from '../types';

const API_BASE = '/api';
const TOKEN_KEY = 'vietphuc_remix_token';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  recoveryCode?: string;
}

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
}

function getAuthHeaders(includeContentType = true): HeadersInit {
  const headers: Record<string, string> = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth Token helpers
  getToken(): string | null {
    return getStoredToken();
  },

  setToken(token: string | null): void {
    setStoredToken(token);
  },

  // Generates authorized image URL for private result pictures
  getProtectedImageUrl(url?: string): string {
    if (!url) return '';
    if (!url.startsWith('/assets/results/')) return url;
    const token = getStoredToken();
    if (!token) return url;
    return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
  },

  // Auth Endpoints
  async register(payload: { email: string; name: string; password: string }): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || 'Đăng ký tài khoản thất bại.');
    }
    setStoredToken(json.data.token);
    return json.data;
  },

  async login(payload: { email: string; password: string }): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || 'Đăng nhập thất bại.');
    }
    setStoredToken(json.data.token);
    return json.data;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(false)
      });
    } catch {}
    setStoredToken(null);
  },

  async getMe(): Promise<UserProfile | null> {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(false)
      });
      if (!res.ok) {
        setStoredToken(null);
        return null;
      }
      const json = await res.json();
      return json.data.user;
    } catch {
      return null;
    }
  },

  async forgotPassword(payload: { email: string; recoveryCode: string }): Promise<{ message: string; resetToken?: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || 'Yêu cầu khôi phục mật khẩu thất bại.');
    }
    return json;
  },

  async resetPassword(payload: { resetToken: string; newPassword: string }): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || 'Đặt lại mật khẩu thất bại.');
    }
  },

  // Events (Public)
  async getEvents(): Promise<EventItem[]> {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error('Không thể tải danh sách sự kiện');
    const json = await res.json();
    return json.data;
  },

  // Costumes (Public)
  async getCostumes(params?: { eventId?: string; gender?: string; era?: string }): Promise<Costume[]> {
    const query = new URLSearchParams();
    if (params?.eventId) query.append('eventId', params.eventId);
    if (params?.gender && params.gender !== 'all') query.append('gender', params.gender);
    if (params?.era && params.era !== 'all') query.append('era', params.era);

    const url = `${API_BASE}/costumes${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Không thể tải danh sách Việt phục');
    const json = await res.json();
    return json.data;
  },

  async getCostume(id: string): Promise<Costume> {
    const res = await fetch(`${API_BASE}/costumes/${id}`);
    if (!res.ok) throw new Error('Không thể tải chi tiết Việt phục');
    const json = await res.json();
    return json.data;
  },

  // Backgrounds (Public)
  async getBackgrounds(): Promise<BackgroundSetting[]> {
    const res = await fetch(`${API_BASE}/backgrounds`);
    if (!res.ok) throw new Error('Không thể tải danh sách bối cảnh');
    const json = await res.json();
    return json.data;
  },

  // Drafts (Protected per user)
  async getDrafts(): Promise<FittingDraft[]> {
    const res = await fetch(`${API_BASE}/drafts`, {
      headers: getAuthHeaders(false)
    });
    if (res.status === 401) {
      return [];
    }
    if (!res.ok) throw new Error('Không thể tải danh sách bản phác thảo');
    const json = await res.json();
    return json.data;
  },

  async getDraft(id: string): Promise<FittingDraft> {
    const res = await fetch(`${API_BASE}/drafts/${id}`, {
      headers: getAuthHeaders(false)
    });
    if (!res.ok) throw new Error('Không tìm thấy bản phác thảo');
    const json = await res.json();
    return json.data;
  },

  async saveDraft(draft: Partial<FittingDraft>): Promise<FittingDraft> {
    const res = await fetch(`${API_BASE}/drafts`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(draft)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi lưu bản phác thảo');
    }
    const json = await res.json();
    return json.data;
  },

  async deleteDraft(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/drafts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi xóa bản phác thảo');
    }
  },

  // AI Jobs (Protected per user with Rate Limit checks)
  async getAIUsage(): Promise<{ usage: number; max: number; totalUsage?: number; totalMax?: number }> {
    const res = await fetch(`${API_BASE}/ai/jobs/usage`, {
      headers: getAuthHeaders(false)
    });
    if (!res.ok) return { usage: 0, max: 5, totalUsage: 0, totalMax: 20 };
    const json = await res.json();
    return json.data;
  },

  async getAIJobs(): Promise<AIJob[]> {
    const res = await fetch(`${API_BASE}/ai/jobs`, {
      headers: getAuthHeaders(false)
    });
    if (res.status === 401) {
      return [];
    }
    if (!res.ok) throw new Error('Không thể tải danh sách công việc AI');
    const json = await res.json();
    return json.data;
  },

  async getAIJob(id: string): Promise<AIJob> {
    if (!id || typeof id !== 'string') {
      throw new Error('Mã tiến trình không hợp lệ');
    }
    const cleanId = encodeURIComponent(id.trim());
    const res = await fetch(`${API_BASE}/ai/jobs/${cleanId}`, {
      headers: getAuthHeaders(false)
    });
    if (!res.ok) throw new Error('Không tìm thấy tiến trình AI');
    const json = await res.json();
    return json.data;
  },

  async submitAIJob(payload: {
    draftId?: string;
    costumeId: string;
    costumeName: string;
    eventName: string;
    modelGender?: 'male' | 'female';
    remixStyle: string;
    colorName?: string;
    materialName?: string;
    accessories?: string[];
    backgroundName?: string;
    customPrompt?: string;
    referenceImageUrl?: string;
    sketchDataUrl: string;
  }): Promise<AIJob> {
    const res = await fetch(`${API_BASE}/ai/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi gửi yêu cầu AI');
    }
    const json = await res.json();
    return json.data;
  },

  async retryAIJob(id: string): Promise<AIJob> {
    const res = await fetch(`${API_BASE}/ai/jobs/${id}/retry`, {
      method: 'POST',
      headers: getAuthHeaders(false)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi thử lại yêu cầu AI');
    }
    const json = await res.json();
    return json.data;
  },

  async deleteAIJob(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/ai/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi xóa tác vụ AI');
    }
  }
};
