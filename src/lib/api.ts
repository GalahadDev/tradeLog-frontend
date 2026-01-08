import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { User, Trade, CalendarMetric, TradingStats } from '@/types'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 1. INYECTAR TOKEN
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return config;
});

// 2. INTERCEPTOR DE ERRORES
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.error === 'ACCOUNT_PENDING') {
      window.location.href = '/pending'; 
    }
    return Promise.reject(error);
  }
);

export default api;

// --- SERVICIOS ---

export const userService = {
  getMe: () => api.get<{ user: User }>('/users/me'),
  updateMe: (data: Partial<User>) => api.patch('/users/me', data),
};

export const adminService = {
  getAllUsers: () => api.get<{ users: User[] }>('/admin/users'),
  getUser: (id: string) => api.get<{ user: User }>(`/admin/users/${id}`),
  updateUser: (id: string, data: Partial<User>) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

//  Servicio de Trades (CRUD)
export const tradeService = {
  // Listar con paginación
  getAll: (page = 1, limit = 10) => 
    api.get<{ data: Trade[], meta: { total: number, page: number, limit: number } }>(`/trades?page=${page}&limit=${limit}`),
  
  // Obtener uno por ID
  getById: (id: string) => 
    api.get<{ trade: Trade }>(`/trades/${id}`),
  
  // Crear
  create: (data: Partial<Trade>) => 
    api.post('/trades', data),
  
  // Actualizar
  update: (id: string, data: Partial<Trade>) => 
    api.patch(`/trades/${id}`, data),
  
  // Borrar
  delete: (id: string) => 
    api.delete(`/trades/${id}`),
};

// Analytics y Dashboard

export const dashboardService = {
  getCalendarMetrics: (startDate?: string, endDate?: string) => 
    api.get<{ data: CalendarMetric[] }>('/dashboard/calendar', { 
      params: { start_date: startDate, end_date: endDate } 
    }),

  //  Endpoint de Estadísticas Avanzadas
  getStats: (startDate?: string, endDate?: string) =>
    api.get<{ stats: TradingStats }>('/dashboard/stats', {
      params: { start_date: startDate, end_date: endDate }
    }),
};

