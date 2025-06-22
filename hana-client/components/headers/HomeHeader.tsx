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
    <div className="w-full px-4 py-4 bg-[#0C8CE9] shadow-sm flex items-center justify-between text-white font-pretendard">
      <div className="flex items-center gap-3">
        <Image
          src="/images/hana_main.png" // ✅ 반드시 public/images/hana_main.png 위치
          alt="logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col items-start text-left gap-0.5">
          <p className="text-sm text-gray-200 tracking-tight">
            안녕하세요, <span className="font-semibold text-white">{userName}</span>님!
          </p>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {faculty}
          </h2>
        </div>
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
      </div>
    </div>
  );
}
