// lib/api/authFetch.ts
import { getSessionModalInstance } from '@/lib/sessionModalInstance';

// authFetch.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function authFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // ✅ 토큰이 필요한 경로만 설정
  const modalRequiredPaths = ['/mypage', '/likes', '/chatbot'];
  const shouldShowModal = modalRequiredPaths.some((p) => pathname.startsWith(p));

  if (!token) {
    if (shouldShowModal) getSessionModalInstance()?.showModal();
    throw new Error('No token');
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if ((res.status === 401 || res.status === 403) && shouldShowModal) {
    getSessionModalInstance()?.showModal();
    throw new Error('Session expired');
  }

  return res;
}
