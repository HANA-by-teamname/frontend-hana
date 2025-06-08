// lib/api/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // 필요 시 true로 (ex. 쿠키 인증 시)
});

// ✅ 요청 시 토큰 자동 첨부
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 에러 처리 (선택)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 서버 응답 에러
      console.error('[응답 에러]', error.response.data);
    } else if (error.request) {
      // 요청 자체 에러
      console.error('[요청 실패]', error.request);
    } else {
      // 그 외
      console.error('[에러]', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
