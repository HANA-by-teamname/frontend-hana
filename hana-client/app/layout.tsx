import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';

export const metadata: Metadata = {
  title: 'HANA',
  description: '하나뿐인 유학생활을 위한 서비스',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#F5F6FA] font-pretendard">
        <UserProvider>
        <div className="max-w-iphone mx-auto min-h-screen bg-white">
          {children}
        </div>
        </UserProvider>
      </body>
    </html>
  );
}
