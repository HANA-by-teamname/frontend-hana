'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return function AuthComponent(props: P) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/'); // 로그인 안 된 상태면 루트(첫 화면)으로 이동
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}