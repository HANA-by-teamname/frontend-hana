'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex justify-center items-center font-pretendard">
      <div className="w-[390px] bg-white rounded-t-3xl overflow-hidden shadow-md">
        {/* 상단 배경 */}
        <div className="bg-gradient-to-b from-sky-300 to-sky-100 text-center py-12">
          <h1 className="text-6xl font-black text-white tracking-wide drop-shadow">HANA</h1>
          <p className="mt-2 text-sm text-white">하나로 행복해진 하나뿐인 유학생활</p>
          <Link href="/landing">
            <span className="inline-block mt-6 px-5 py-2 text-sky-600 bg-white rounded-full shadow text-sm font-semibold">
              하나가 궁금하세요? &gt;
            </span>
          </Link>
        </div>

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
