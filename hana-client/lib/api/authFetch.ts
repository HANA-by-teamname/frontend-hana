// lib/api/authFetch.ts
import { getSessionModalInstance } from '@/lib/sessionModalInstance';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function authFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const modalRequiredPaths = ['/mypage', '/likes', '/chatbot'];
  const shouldShowModal = modalRequiredPaths.some((p) => pathname.startsWith(p));

  // ✅ 로그인 요청에는 토큰 없어도 허용
  const isLoginOrSignup = path.includes('/users/login') || path.includes('/users/signup');

  if (!token && !isLoginOrSignup) {
    if (shouldShowModal) {
      getSessionModalInstance()?.showModal();
    }
    throw new Error('No token');
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  if ((res.status === 401 || res.status === 403) && shouldShowModal) {
    getSessionModalInstance()?.showModal();
    throw new Error('Session expired');
  }

  return res;
}
