// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// إنشاء instance من axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // للـ cookies و sessions
});

// Request interceptor لإضافة التوكن
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // الخادم أرسل رد بحالة خطأ
      switch (error.response.status) {
        case 401:
          // غير مصرح
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Requested resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(error.response.data.error || 'An error occurred.');
      }
    } else if (error.request) {
      // الطلب تم إرساله ولكن لم يتم استلام رد
      toast.error('Network error. Please check your connection.');
    } else {
      // حدث خطأ في إعداد الطلب
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default api;