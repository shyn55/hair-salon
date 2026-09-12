const API_BASE = 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
    const { method = 'GET', body, params, auth = false } = options;
    let url = `${API_BASE}${endpoint}`;
    if (params) {
        const sp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => { if (v != null) sp.append(k, v); });
        const qs = sp.toString();
        if (qs) url += `?${qs}`;
    }
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = localStorage.getItem('admin_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const config = { method, headers, credentials: 'include' };
    if (body && method !== 'GET') config.body = JSON.stringify(body);
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Server error');
    return data;
};

// ─── Profile ───────────────────────────────────────
export const fetchProfile = () => apiRequest('/profile');
export const updateProfile = (data) => apiRequest('/profile', { method: 'PUT', body: data, auth: true });
export const fetchSocialLinks = () => apiRequest('/profile/social-links');
export const addSocialLink = (data) => apiRequest('/profile/social-links', { method: 'POST', body: data, auth: true });
export const updateSocialLink = (id, data) => apiRequest(`/profile/social-links/${id}`, { method: 'PUT', body: data, auth: true });
export const deleteSocialLink = (id) => apiRequest(`/profile/social-links/${id}`, { method: 'DELETE', auth: true });

// ─── Customer (Public) ─────────────────────────────
export const fetchServices = (gender) => apiRequest('/customer/services', { params: { gender } });
export const fetchCategories = () => apiRequest('/customer/categories');
export const fetchAvailability = (date, serviceId) => apiRequest('/customer/availability', { params: { date, serviceId } });
export const fetchWorkingHours = () => apiRequest('/customer/working-hours');
export const fetchDayStatus = (date, serviceId) => apiRequest('/customer/day-status', { params: { date, serviceId } });

// ─── Bookings ──────────────────────────────────────
export const createBooking = (data) => apiRequest('/bookings/create', { method: 'POST', body: data });
export const fetchAvailableTimes = (date, serviceId) => apiRequest('/bookings/available-times', { params: { date, serviceId } });

// ─── Auth ──────────────────────────────────────────
export const login = (username, password) => apiRequest('/auth/login', { method: 'POST', body: { username, password } });
export const fetchAuthProfile = () => apiRequest('/auth/profile', { auth: true });

// ─── Dashboard (Admin) ────────────────────────────
export const fetchDashboardStats = () => apiRequest('/dashboard/stats', { auth: true });
export const fetchAllBookings = (params) => apiRequest('/dashboard/bookings', { params, auth: true });
export const updateBookingStatus = (id, status) => apiRequest(`/dashboard/bookings/${id}/status`, { method: 'PATCH', body: { status }, auth: true });

// ─── Services (Admin) ─────────────────────────────
export const fetchAllServices = (params) => apiRequest('/services', { params, auth: true });
export const createService = (data) => apiRequest('/services', { method: 'POST', body: data, auth: true });
export const updateService = (id, data) => apiRequest(`/services/${id}`, { method: 'PUT', body: data, auth: true });
export const deleteService = (id) => apiRequest(`/services/${id}`, { method: 'DELETE', auth: true });
export const fetchAllCategories = () => apiRequest('/services/categories', { auth: true });
export const createCategory = (data) => apiRequest('/services/categories', { method: 'POST', body: data, auth: true });

// ─── Gallery (Admin) ──────────────────────────────
export const fetchGallery = (params) => apiRequest('/gallery', { params });
export const createGalleryItem = (data) => apiRequest('/gallery', { method: 'POST', body: data, auth: true });
export const updateGalleryItem = (id, data) => apiRequest(`/gallery/${id}`, { method: 'PUT', body: data, auth: true });
export const deleteGalleryItem = (id) => apiRequest(`/gallery/${id}`, { method: 'DELETE', auth: true });

// ─── Staff / Working Hours (Admin) ────────────────
export const fetchWorkingHoursAdmin = () => apiRequest('/staff/working-hours', { auth: true });
export const updateWorkingHours = (id, data) => apiRequest(`/staff/working-hours/${id}`, { method: 'PUT', body: data, auth: true });
export const addBreak = (data) => apiRequest('/staff/breaks', { method: 'POST', body: data, auth: true });
export const removeBreak = (id) => apiRequest(`/staff/breaks/${id}`, { method: 'DELETE', auth: true });

// ─── Settings ──────────────────────────────────────
export const fetchSettings = () => apiRequest('/settings');
export const updateSettings = (data) => apiRequest('/settings', { method: 'PUT', body: data, auth: true });

export default apiRequest;
