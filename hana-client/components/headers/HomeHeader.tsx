'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HomeHeaderProps {
  userName: string;
  faculty: string;
}

export default function HomeHeader({ userName, faculty }: HomeHeaderProps) {
  const router = useRouter();
  const [translateOn, setTranslateOn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('translate');
    if (saved === 'true') setTranslateOn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('translate', String(translateOn));
  }, [translateOn]);

  return (
    <div className="w-full px-4 py-4 bg-[#F9FAFB] shadow-sm flex items-center justify-between">
      <div className="flex flex-col items-start text-left gap-0.5">
        <p className="text-sm text-gray-600 tracking-tight">
          안녕하세요, <span className="font-semibold">{userName}</span>님!
        </p>
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
          {faculty}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTranslateOn((prev) => !prev)}
          aria-label="번역 토글"
          className="p-1"
        >
          <Image
            src={
              translateOn
                ? '/icons/translate_state=true.png'
                : '/icons/translate_state=false.png'
            }
            alt="번역 토글"
            width={28}
            height={28}
          />
        </button>

        <button
          onClick={() => router.push('/notifications')}
          aria-label="알림 보기"
          className="p-1"
        >
          <Image
            src="/icons/notifications_active.png"
            alt="알림 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
