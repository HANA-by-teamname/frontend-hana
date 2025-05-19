// lib/api/auth.ts
export async function login(email: string, password: string) {
  const res = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 200) {
    const { token } = await res.json();
    return { success: true, token };
    
  } else if (res.status === 404) {
    return { success: false, reason: 'not_found' };
  } else {
    return { success: false, reason: 'invalid' };
  }
}

// signup

export async function signup(payload: {
  email: string;
  password: string;
  nickname: string;
  gender: 'male' | 'female';
  birthday: string;
  school: string;
  native_language: 'ko' | 'en' | 'zh' | 'ja' | 'vi';
  terms_agreement: boolean;
  privacy_agreement: boolean;
  marketing_agreement?: boolean;
  third_party_agreement?: boolean;
}) {
  const res = await fetch('http://localhost:8000/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.reason || '회원가입 실패');
  }
  return data;
}
