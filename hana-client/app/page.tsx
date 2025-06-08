'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const timer = setTimeout(() => {
      if (token) {
        router.push('/home'); // 로그인 되어있으면 대시보드로
      } else {
        router.push('/users/login'); // 아니면 로그인으로
      }
    }, 5000);

    return () => clearTimeout(timer); // cleanup
  }, [router]);

  return (
    <main
  className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-center items-center"
  style={{
    backgroundImage:
      'url(https://i.pinimg.com/736x/1c/96/99/1c9699434ebaddf52f7f9173ce8b664f.jpg)',
  }}
>
  {/* 중앙 정렬된 텍스트 그룹 */}
  <div className="text-center">
    {/* 작은 문구 (Welcome 위에) */}
    <p className="text-xs text-gray-700 tracking-widest mb-2">
      Your dreams come true
    </p>

    {/* 중앙 Welcome 메시지 */}
    <h1 className="text-white text-2xl font-semibold drop-shadow">
      Welcome to HANA
    </h1>
  </div>
</main>

  );
}
