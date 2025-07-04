// ✅ /app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { SessionModalProvider } from '@/contexts/SessionModalContext';
import { UserProvider } from '@/contexts/UserContext';
import dynamic from 'next/dynamic';

const SessionModalWrapper = dynamic(() => import('@/components/SessionModalWrapper'), { ssr: false });

export const metadata: Metadata = {
  title: 'HANA',
  description: '하나뿐인 유학생활을 위한 서비스',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no', // ✅ 줌 방지 설정
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#F5F6FA] font-pretendard">
        <SessionModalProvider>
          <SessionModalWrapper />
          <UserProvider>
            <div className="max-w-iphone mx-auto min-h-screen bg-white">
              {children}
            </div>
          </UserProvider>
        </SessionModalProvider>
      </body>
    </html>
  );
}
