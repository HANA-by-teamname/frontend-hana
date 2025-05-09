'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <main className="min-h-screen bg-[#C8D2FC] flex justify-center items-center font-pretendard">
      <div className="w-[390px] bg-white rounded-t-3xl overflow-hidden shadow-md">
        {/* 상단 배경 */}
        <div className="bg-gradient-to-b from-sky-300 to-sky-100 text-center py-10">
          <h1 className="text-4xl font-bold text-white tracking-wide">회원가입</h1>
        </div>

        {/* 가입 폼 */}
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
          <input
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b py-2 text-sm focus:outline-none"
          />

          <button className="w-full mt-6 bg-sky-500 text-white py-2 rounded-md font-semibold">
            회원가입하기
          </button>

          <div className="text-center mt-4 text-xs text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-sky-500">로그인</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
