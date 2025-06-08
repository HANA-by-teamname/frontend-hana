'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) return;

    const fetchKakaoUser = async () => {
      try {
        const res = await fetch(`http://localhost:4000/users/social/kakao?code=${code}`);
        const data = await res.json();

        if (data.success && data.token) {
          localStorage.setItem('token', data.token);
          router.push('/home');
        } else if (data.success && data.email) {
          // ✅ 여기서 회원가입 페이지로 이동!
          router.push(`/signup?email=${encodeURIComponent(data.email)}&provider=kakao`);
          if (data.success && data.email) {
  console.log('➡️ 회원가입 페이지로 이동!');
  router.push(`/signup?email=${encodeURIComponent(data.email)}&provider=kakao`);
}
        } else {
          console.error('알 수 없는 응답:', data);
        }
      } catch (err) {
        console.error('카카오 로그인 실패:', err);
      }
    };

    fetchKakaoUser();
  }, [code, router]);

  return <p>카카오 로그인 처리 중...</p>;
}
