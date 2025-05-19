// social login에서 비밀번호 추가 입력받지 않으려면
// 가짜 password를 생성해야 함

'use client';

import SignupForm from '@/components/SignupForm';
import { useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const searchParams = useSearchParams();

  // 쿼리로부터 사전 정보 수집
  const presetEmail = searchParams.get('email') || '';
  const provider = searchParams.get('provider'); // kakao, google 등

  return (
    <SignupForm
      presetEmail={presetEmail}
      provider={provider} // provider가 null이면 일반 가입 흐름
    />
  );
}
