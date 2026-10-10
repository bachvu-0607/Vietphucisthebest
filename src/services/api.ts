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

// Cookie session survives reload; bearer token is only kept in memory.
let memoryToken: string | null = null;
try { localStorage.removeItem(TOKEN_KEY); } catch {}
function getStoredToken(): string | null { return memoryToken; }
function setStoredToken(token: string | null): void { memoryToken = token; }

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
  async getSystemMonitor() {
    const res = await fetch(`${API_BASE}/system/monitor`, {headers:getAuthHeaders(false)});
    if (!res.ok) throw new Error('Không đọc được thống kê hệ thống.');
    return (await res.json()).data;
  },
  // Auth Token helpers
  getToken(): string | null {
    return getStoredToken();
  },

  setToken(token: string | null): void {
    setStoredToken(token);
  },

  // Generates authorized image URL for private result pictures
  getProtectedImageUrl(url?: string, size: 'thumb' | 'detail' | 'original' = 'detail'): string {
    if (!url) return '';
    if (!url.startsWith('/assets/results/') || size === 'original') return url;
    return `${url}?preview=1&size=${size}`;
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
    const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: getAuthHeaders(false) });
    if (!res.ok) throw new Error('Chưa đăng xuất được. Vui lòng thử lại.');
    setStoredToken(null);
  },

  async getMe(): Promise<UserProfile | null> {

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

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/change-password`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ oldPassword, newPassword }) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Không thể đổi mật khẩu.');
    setStoredToken(null);
  },
  async issueRecoveryCode(password: string): Promise<string> {
    const res = await fetch(`${API_BASE}/auth/recovery-code`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ password }) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Không thể tạo mã.');
    return json.data.recoveryCode;
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

  // Chat assistant (guests allowed, daily quota per account or IP)
  async getChatUsage(): Promise<{ enabled: boolean; limit: number; remaining: number } | null> {
    try {
      const res = await fetch(`${API_BASE}/chat/usage`, { headers: getAuthHeaders(false) });
      return res.ok ? (await res.json()).data : null;
    } catch { return null; }
  },

  async sendChat(messages: { role: 'user' | 'model'; text: string }[], costumeId?: string): Promise<{ reply: string; remaining: number }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ messages, costumeId })
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) throw new Error(json?.error || 'Trợ lý chưa trả lời được. Vui lòng thử lại.');
    return json.data;
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
