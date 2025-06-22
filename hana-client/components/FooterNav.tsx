'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '@/lib/utils/translate';

interface FooterNavProps {
  nativeLanguage?: string;
  translateOn?: boolean;
}

const navItems = [
  { name: '홈', href: '/home', icon: 'Store.svg' },
  { name: '검색', href: '/search', icon: 'Dotbogi.svg' }, // ✅ 변경됨
  { name: '채팅', href: '/chatbot', icon: 'Explore.svg' },
  { name: '마이', href: '/mypage', icon: 'Profile.svg' },
];

export default function FooterNav({ nativeLanguage = 'ko', translateOn = false }: FooterNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto h-16 bg-white border-t border-gray-200 z-50 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const displayText = translateOn ? t(item.name, nativeLanguage) : item.name;

        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-xs"
          >
            <img
              src={`/icons/${item.icon}`}
              alt={item.name}
              className={`w-6 h-6 mb-1 ${isActive ? '' : 'grayscale opacity-50'}`}
            />
            <span className={isActive ? 'text-black font-semibold' : 'text-gray-400'}>
              {displayText}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
