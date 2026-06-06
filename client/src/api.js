const API_BASE = 'http://localhost:4000/api';

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (response.status === 204) return null;
  const json = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('marketer');
    }
    throw new Error(json.message || `API Error: ${response.status}`);
  }
  return json; // Returns the full envelope { success, message, data, meta }
};

export const api = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const envelope = await handleResponse(res);
    const { accessToken, refreshToken, marketer } = envelope.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('marketer', JSON.stringify(marketer));
    return marketer;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('marketer');
  },

  getCurrentMarketer() {
    try {
      const marketerStr = localStorage.getItem('marketer');
      return marketerStr ? JSON.parse(marketerStr) : null;
    } catch {
      return null;
    }
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const envelope = await handleResponse(res);
    return envelope.data;
  },

  async getUsers(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });

    const res = await fetch(`${API_BASE}/users?${query.toString()}`, {
      headers: getHeaders()
    });
    return await handleResponse(res);
  },

  async getUser(id) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      headers: getHeaders()
    });
    const envelope = await handleResponse(res);
    return envelope.data;
  },

  async createCampaign(name, userIds) {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, userIds })
    });
    const envelope = await handleResponse(res);
    return envelope.data; // Returns the campaign object with generated items
  },

  async getCampaigns() {
    const res = await fetch(`${API_BASE}/campaigns`, {
      headers: getHeaders()
    });
    const envelope = await handleResponse(res);
    return envelope.data;
  },

  async getCampaign(id) {
    const res = await fetch(`${API_BASE}/campaigns/${id}`, {
      headers: getHeaders()
    });
    const envelope = await handleResponse(res);
    return envelope.data;
  },

  async approveCampaignItem(id) {
    const res = await fetch(`${API_BASE}/campaign-items/${id}/approve`, {
      method: 'POST',
      headers: getHeaders()
    });
    const envelope = await handleResponse(res);
    return envelope.data;
  },

  async rejectCampaignItem(id, feedback) {
    const res = await fetch(`${API_BASE}/campaign-items/${id}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ feedback })
    });
    const envelope = await handleResponse(res);
    return envelope.data; // Returns the newly regenerated item
  }
};
