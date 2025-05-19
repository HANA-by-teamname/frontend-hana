'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/api/auth'; // 👈 방금 만든 함수 가져오기

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const router = useRouter();

  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      localStorage.setItem('token', result.token); // 또는 쿠키 등
      router.push('/dashboard'); // 로그인 성공 → 이동
    } else if (result.reason === 'not_found') {
      router.push(`/auth/signup?email=${email}&password=${password}`); // 회원가입으로
    } else {
      alert('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex justify-center items-center font-pretendard">
      <div className="w-[390px] bg-white rounded-t-3xl overflow-hidden shadow-md">
        {/* 상단 생략 */}

        {/* 로그인 폼 */}
        <div className="px-6 py-8 space-y-4">
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b py-2 text-sm focus:outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b py-2 text-sm focus:outline-none"
          />

          <label className="flex items-center space-x-2 mt-2 text-sm text-gray-700">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>로그인 상태 유지</span>
          </label>

          {/* ✅ 로그인 버튼 추가 */}
          <button
            onClick={handleLogin}
            className="w-full bg-sky-500 py-2 rounded-md text-white font-semibold mt-4"
          >
            이메일로 로그인
          </button>

          {/* 소셜 로그인 */}
          <div className="mt-6 space-y-3">
            <button className="w-full bg-yellow-300 py-2 rounded-md font-semibold text-black">
              카카오톡으로 쉬운 시작
            </button>
            <button className="w-full bg-gray-100 py-2 rounded-md font-semibold text-black">
              구글 계정으로 쉬운 시작
            </button>
          </div>

          {/* 하단 링크 */}
          <div className="text-center mt-6 text-xs text-gray-500 space-x-2">
            <Link href="/auth/signup">이메일로 회원가입</Link>
            <span>/</span>
            <Link href="/auth/reset-password">비밀번호를 잊으셨나요?</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
