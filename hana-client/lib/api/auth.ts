const BASE_URL = 'http://localhost:4000';
const LOGIN_ENDPOINT = `${BASE_URL}/users/login`;
const SIGNUP_ENDPOINT = `${BASE_URL}/users/signup`;

// 로그인 함수
export async function login(email: string, password: string) {
  const url = 'http://localhost:4000/users/login';
  console.log('🚀 로그인 요청 보내는 URL:', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  console.log('📦 로그인 응답 내용:', text);

  try {
    const data = JSON.parse(text);
    if (res.status === 200) {
      return { success: true, token: data.token };
    } else if (res.status === 404) {
      return { success: false, reason: 'not_found' };
    } else {
      return { success: false, reason: 'invalid' };
    }
  } catch (e) {
    console.error('⚠️ JSON 파싱 실패:', e);
    console.log('🚀 로그인 요청 보내는 URL:', url);
    console.log('📦 로그인 응답 내용:', text);
    throw new Error('서버에서 올바르지 않은 응답을 받았습니다.');
  }
}


// 회원가입 함수
// lib/api/auth.ts

export async function signup(payload: {
  email: string;
  password: string;
  name: string;
  gender: 'male' | 'female';
  birthdate: string;
  faculty: string;  // ✅ 수정: school → faculty
  native_language: 'ko' | 'en' | 'zh' | 'ja' | 'vi';
  terms_agreement: boolean;
  privacy_agreement: boolean;
  marketing_agreement?: boolean;
  third_party_agreement?: boolean;
}) {
  const res = await fetch(SIGNUP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), // faculty 포함됨
  });

  const text = await res.text();
  console.log('📦 회원가입 응답 내용:', text);

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.reason || '회원가입 실패');
    }

    return data;
  } catch (err) {
    console.error('⚠️ 회원가입 응답 JSON 파싱 실패:', err);
    throw new Error('서버에서 올바르지 않은 응답을 받았습니다.');
  }
}
