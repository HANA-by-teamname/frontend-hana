'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/utils/translate';

interface HomeHeaderProps {
  userName: string;
  faculty: string;
  translateOn: boolean;
  nativeLanguage: string;
  toggleTranslate: () => void;
}

export default function HomeHeader({
  userName,
  faculty,
  translateOn,
  nativeLanguage,
  toggleTranslate,
}: HomeHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full px-4 py-4 bg-[#0C8CE9] shadow-sm flex items-center justify-between text-white font-pretendard">
      <div className="flex items-center gap-3">
        <Image
          src="/images/hana_main.png"
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
            {translateOn ? t(faculty, nativeLanguage) : faculty}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTranslate}
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
