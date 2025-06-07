// lib/api/getCurrentUser.ts

import { fetchWithAuth } from './fetchWithAuth';

export async function getCurrentUser() {
  const res = await fetchWithAuth('/users/me');
  if (!res.ok) throw new Error('유저 정보 불러오기 실패');
  return res.json();
}
