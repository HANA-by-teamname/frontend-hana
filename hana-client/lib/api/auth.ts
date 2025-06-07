import {
  LOGIN_ENDPOINT,
  SIGNUP_ENDPOINT,
  CHECK_NICKNAME_ENDPOINT,
} from '../constants';

export async function login(email: string, password: string) {
  const res = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (res.status === 200) return { success: true, token: data.token };
    if (res.status === 404) return { success: false, reason: 'not_found' };
    return { success: false, reason: 'invalid' };
  } catch (e) {
    console.error('⚠️ JSON 파싱 실패:', e);
    throw new Error('서버에서 올바르지 않은 응답을 받았습니다.');
  }
}

export async function signup(payload: /* ... */) {
  const res = await fetch(SIGNUP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`${CHECK_NICKNAME_ENDPOINT}?nickname=${encodeURIComponent(nickname)}`);
  if (!res.ok) throw new Error("닉네임 중복 확인 실패");
  const data = await res.json();
  return data.exists;
}
