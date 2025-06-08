'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftCircle } from 'lucide-react';

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [statusMessage, setStatusMessage] = useState('카카오 계정 확인 중입니다...');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!code) return;

    const fetchKakaoUser = async () => {
      try {
        setStatusMessage('카카오 계정 인증 중...');
        const res = await fetch(`http://localhost:4000/users/social/kakao?code=${code}`);
        const data = await res.json();

        if (data.success && data.token) {
          localStorage.setItem('token', data.token);
          setStatusMessage('로그인 완료! 홈으로 이동 중...');
          setTimeout(() => router.push('/home'), 1000);
          return;
        }

        if (data.success && data.email) {
          setStatusMessage('가입되지 않은 계정입니다. 회원가입 페이지로 이동합니다.');
          setTimeout(() => {
            router.push(`/signup?email=${encodeURIComponent(data.email)}&provider=kakao`);
          }, 2000);
          return;
        }

        // 알 수 없는 응답 → 3초 후 에러 표시
        setStatusMessage('잠시만 더 기다려주세요');
        setTimeout(() => setHasError(true), 12000);
      } catch (err) {
        console.error('❌ 카카오 로그인 실패:', err);
        localStorage.removeItem('token');
        setStatusMessage('잠시만 더 기다려주세요');
        setTimeout(() => setHasError(true), 12000);
      }
    };

    fetchKakaoUser();
  }, [code, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      {!hasError && (
        <>
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-300 border-t-blue-600 mb-6" />
          <p className="text-blue-700 text-base font-medium">{statusMessage}</p>
        </>
      )}

      {hasError && (
        <>
          <p className="text-red-600 text-base font-semibold mb-6">{statusMessage}</p>
          <button
            onClick={() => router.push('/users/login')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-full transition"
          >
            <ArrowLeftCircle size={18} className="stroke-white" />
            다시 로그인하기
          </button>
        </>
      )}
    </div>
  );
}
