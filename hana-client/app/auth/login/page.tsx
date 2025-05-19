'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login, signup } from '@/lib/api/auth'; // signup 함수 추가 필요

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
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
      // 자동 회원가입 시도
      try {
        const signupResult = await signup({
          email,
          password,
          nickname: '신규 사용자', // 기본값 설정
          gender: 'male', // 임시 기본값 (추후 사용자 설정 받게 수정 가능)
          birthday: '2000-01-01',
          school: '미입력',
          native_language: 'ko',
          terms_agreement: true,
          privacy_agreement: true,
        });
        localStorage.setItem('token', signupResult.token);
        router.push('/home');
      } catch (e: any) {
        if (e.message.includes('이미 가입')) {
          setGeneralError('이미 가입된 계정이 있어요.');
        } else {
          setGeneralError(e.message || '회원가입 중 오류가 발생했어요.');
        }
      }
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
          {/* 이메일 입력 */}
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

          {/* 비밀번호 입력 */}
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

          {/* 로그인 상태 유지 */}
          <label className="flex items-center space-x-2 mt-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>로그인 상태 유지</span>
          </label>

          {/* 에러 메시지 */}
          {generalError && (
            <p className="text-red-500 text-sm mt-2">{generalError}</p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-sky-500 py-2 rounded-md text-white font-bold mt-4"
          >
            이메일로 로그인/회원가입
          </button>
          {/* 소셜 로그인 영역 복원! */}

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
    </main>
  );
}
