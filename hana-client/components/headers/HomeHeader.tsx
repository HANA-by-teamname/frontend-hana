'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HomeHeaderProps {
  userName: string;
  school: string;
}

export default function HomeHeader({ userName, school }: HomeHeaderProps) {
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
    <div className="w-full bg-white px-6 py-4 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-sm text-[#4B4B4B]">
          안녕하세요, <span className="font-semibold">{userName}</span>님!
        </p>
        <h2 className="text-xl font-bold mt-1">{school}</h2>
      </div>

      <div className="flex items-center gap-3">
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
            width={32}
            height={32}
          />
        </button>

        <button
          onClick={() => router.push('/notifications')}
          aria-label="알림 보기"
          className="p-1"
        >
          <Image
            src="/icons/notifications_active.png"
            alt="Notification"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
