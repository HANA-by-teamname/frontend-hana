import { Suspense } from 'react';
import HomePage from './HomePage';

export default function Page() {
  return (
    <Suspense fallback={<div>홈페이지 로딩 중...</div>}>
      <HomePage />
    </Suspense>
  );
}
