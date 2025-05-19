'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/api/auth'; // 자동 signup 제거

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [showSignupConfirm, setShowSignupConfirm] = useState(false); // ✅ 모달 제어용
  const router = useRouter();

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;

    if (!email) {
      setEmailError('* 이메일을 입력해주세요');
      hasError = true;
    }

    if (!password) {
      setPasswordError('* 비밀번호를 입력해주세요');
      hasError = true;
    }

    if (hasError) return;

    const result = await login(email, password);

    if (result.success) {
      localStorage.setItem('token', result.token);
      router.push('/home');
    } else if (result.reason === 'not_found') {
      // ✅ 자동 회원가입 X, 모달 띄움
      setShowSignupConfirm(true);
    } else {
      setGeneralError('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center items-center font-pretendard">
      <div className="w-full max-w-[390px] px-6 py-8 space-y-4">
        {/* 로고 및 안내 문구 */}
        <div className="text-center pt-6">
          <h1 className="text-5xl font-black text-sky-500 drop-shadow">HANA</h1>
          <p className="text-sm text-gray-500 mt-2">하나로 행복해진 하나뿐인 유학생활</p>
        </div>

        {/* 로그인 폼 */}
        <div className="px-6 py-8 space-y-4">
          <div>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border-b py-2 text-sm focus:outline-none ${
                emailError ? 'border-red-500' : ''
              }`}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border-b py-2 text-sm focus:outline-none ${
                passwordError ? 'border-red-500' : ''
              }`}
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          <label className="flex items-center space-x-2 mt-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>로그인 상태 유지</span>
          </label>

          {generalError && (
            <p className="text-red-500 text-sm mt-2">{generalError}</p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-sky-500 py-2 rounded-md text-white font-bold mt-4"
          >
            이메일로 로그인/회원가입
          </button>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => router.push('/auth/callback/kakao')}
              className="w-full bg-yellow-300 py-2 rounded-md font-bold text-black"
            >
              카카오톡으로 쉬운 시작
            </button>
            <button
              type="button"
              onClick={() => router.push('/auth/callback/google')}
              className="w-full bg-gray-100 py-2 rounded-md font-bold text-black"
            >
              구글 계정으로 쉬운 시작
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 회원가입 유도 모달 */}
      {showSignupConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">
            <h2 className="text-lg font-bold mb-4">회원가입 안내</h2>
            <p className="text-sm mb-6"> 계정이 존재하지 않아요.<br />회원가입하시겠어요?</p>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setShowSignupConfirm(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md font-bold"
              >
                다시 돌아가기
              </button>
              <button
                onClick={() => router.push(`/auth/signup?email=${encodeURIComponent(email)}`)} // ✅ 여기!
                className="flex-1 py-2 bg-sky-500 text-white rounded-md font-bold"
              >
                회원가입하러 가기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
