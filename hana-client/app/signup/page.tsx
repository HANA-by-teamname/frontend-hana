import { Suspense } from 'react';
import SignupPage from './SignupPageClient'; // 새로 분리한 CSR 컴포넌트

export default function Page() {
  return (
    <Suspense fallback={<div> </div>}>
      <SignupPage />
    </Suspense>
  );
}
