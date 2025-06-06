const BASE_URL = 'http://localhost:4000';
const LOGIN_ENDPOINT = `${BASE_URL}/users/login`;
const SIGNUP_ENDPOINT = `${BASE_URL}/users/signup`;
const CHECK_NICKNAME_ENDPOINT = `${BASE_URL}/users/check-nickname`;

export async function login(email: string, password: string) {
  const url = LOGIN_ENDPOINT;
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
    throw new Error('서버에서 올바르지 않은 응답을 받았습니다.');
  }
}

// ✅ 수정된 회원가입 함수
export async function signup(payload: {
  email: string;
  password: string;
  name: string;
  nickname: string;
  gender: 'male' | 'female';
  birthdate: string;
  faculty: string; // ✅ 단일 학부
  data_sources: string[]; // ✅ 관심 학부 목록
  native_language: 'ko' | 'en' | 'zh' | 'ja' | 'vi';
  terms_agreement: boolean;
  privacy_agreement: boolean;
  marketing_agreement?: boolean;
  third_party_agreement?: boolean;
}) {
  const res = await fetch(SIGNUP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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

// 닉네임 중복조회 함수 추가
export async function checkNickname(nickname: string): Promise<boolean> {
  const res = await fetch(`${CHECK_NICKNAME_ENDPOINT}?nickname=${encodeURIComponent(nickname)}`);
  if (!res.ok) throw new Error("닉네임 중복 확인 실패");
  const data = await res.json();
  return data.exists; // true면 이미 존재
}
