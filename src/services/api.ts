import { EventItem, Costume, BackgroundSetting, FittingDraft, AIJob } from '../types';

const API_BASE = '/api';

export const api = {
  // Events
  async getEvents(): Promise<EventItem[]> {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error('Không thể tải danh sách sự kiện');
    const json = await res.json();
    return json.data;
  },

  // Costumes
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

  // Backgrounds
  async getBackgrounds(): Promise<BackgroundSetting[]> {
    const res = await fetch(`${API_BASE}/backgrounds`);
    if (!res.ok) throw new Error('Không thể tải danh sách bối cảnh');
    const json = await res.json();
    return json.data;
  },

  // Drafts
  async getDrafts(): Promise<FittingDraft[]> {
    const res = await fetch(`${API_BASE}/drafts`);
    if (!res.ok) throw new Error('Không thể tải danh sách bản phác thảo');
    const json = await res.json();
    return json.data;
  },

  async getDraft(id: string): Promise<FittingDraft> {
    const res = await fetch(`${API_BASE}/drafts/${id}`);
    if (!res.ok) throw new Error('Không tìm thấy bản phác thảo');
    const json = await res.json();
    return json.data;
  },

  async saveDraft(draft: Partial<FittingDraft>): Promise<FittingDraft> {
    const res = await fetch(`${API_BASE}/drafts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_BASE}/drafts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Lỗi khi xóa bản phác thảo');
  },

  // AI Jobs
  async getAIJobs(): Promise<AIJob[]> {
    const res = await fetch(`${API_BASE}/ai/jobs`);
    if (!res.ok) throw new Error('Không thể tải danh sách công việc AI');
    const json = await res.json();
    return json.data;
  },

  async getAIJob(id: string): Promise<AIJob> {
    if (!id || typeof id !== 'string') {
      throw new Error('Mã tiến trình không hợp lệ');
    }
    const cleanId = encodeURIComponent(id.trim());
    const res = await fetch(`${API_BASE}/ai/jobs/${cleanId}`);
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
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_BASE}/ai/jobs/${id}/retry`, { method: 'POST' });
    if (!res.ok) throw new Error('Lỗi khi thử lại yêu cầu AI');
    const json = await res.json();
    return json.data;
  }
};
