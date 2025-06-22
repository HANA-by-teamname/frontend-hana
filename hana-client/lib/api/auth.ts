import {
  LOGIN_ENDPOINT,
  SIGNUP_ENDPOINT,
  CHECK_NICKNAME_ENDPOINT,
} from '../constants';

import { authFetch } from './authFetch'; // 로그인·토큰 필요한 요청

interface SignupPayload {
  email: string;
  password: string;
  name: string;
  nickname: string;
  gender: 'male' | 'female';
  birthdate: string;
  faculty: string;
  data_sources: string[];
  native_language: 'ko' | 'en' | 'zh' | 'ja' | 'vi';
  terms_agreement: boolean;
  privacy_agreement: boolean;
  marketing_agreement?: boolean;
  third_party_agreement?: boolean;
}

export async function login(email: string, password: string) {
  const res = await authFetch(LOGIN_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get('Content-Type');
  const text = await res.text();

  if (!contentType || !contentType.includes('application/json')) {
    console.error('❌ JSON 아님:', text);
    throw new Error('서버에서 JSON이 아닌 응답을 받았습니다.');
  }

  try {
    const data = JSON.parse(text);
    if (res.status === 200) return { success: true, token: data.token };
    if (res.status === 404) return { success: false, reason: 'not_found' };
    return { success: false, reason: 'invalid' };
  } catch (e) {
    console.error('⚠️ JSON 파싱 실패:', e, text);
    throw new Error('서버에서 올바르지 않은 JSON 응답을 받았습니다.');
  }
}

export async function signup(payload: SignupPayload) {
  const res = await authFetch(SIGNUP_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.errors?.[0]?.reason || '회원가입 실패');
    return data;
  } catch (err) {
    console.error('⚠️ 회원가입 응답 JSON 파싱 실패:', err);
    throw new Error('서버에서 올바르지 않은 응답을 받았습니다.');
  }
}

export async function checkNickname(nickname: string): Promise<boolean> {
  const res = await authFetch(`${CHECK_NICKNAME_ENDPOINT}?nickname=${encodeURIComponent(nickname)}`);
  if (!res.ok) throw new Error('닉네임 중복 확인 실패');
  const data = await res.json();
  return data.exists;
}
