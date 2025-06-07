// lib/api/fetchWithAuth.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

/**
 * 인증이 필요한 API 요청에 사용하는 함수
 */
export async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('로그인이 필요합니다.');

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
