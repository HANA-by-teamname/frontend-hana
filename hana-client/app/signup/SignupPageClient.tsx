'use client';

import SignupForm from '@/components/SignupForm';
import { useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const searchParams = useSearchParams();

  const presetEmail = searchParams.get('email') || '';
  const provider = searchParams.get('provider'); // kakao, google 등

  return (
    <SignupForm
      presetEmail={presetEmail}
      provider={provider}
    />
  );
}
