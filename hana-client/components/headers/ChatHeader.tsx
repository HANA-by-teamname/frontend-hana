'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ChatLanguageModal from '@/components/modals/ChatLanguageModal';

export default function ChatHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultLang, setDefaultLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLanguage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('토큰 없음');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`응답 실패: ${res.status}`);

        const user = await res.json();
        if (!user.native_language) throw new Error('사용자 언어 정보 없음');

        setDefaultLang(user.native_language);
      } catch (err) {
        console.error('❌ 사용자 정보 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLanguage();
  }, []);

  const handleLangChange = async (newLang: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/lang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language: newLang }),
      });

      if (!res.ok) throw new Error('❌ 언어 변경 실패');

      setDefaultLang(newLang);
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ 언어 설정 요청 중 오류:', err);
    }
  };

  return (
    <>
      <div className="w-full px-6 py-4 shadow-sm flex items-center justify-between bg-[#F9FAFB]">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">챗봇</h2>
          <p className="text-sm text-gray-500">
            {loading
              ? '사용자 정보를 불러오는 중입니다...'
              : defaultLang
              ? '학교 관련 질문이라면 무엇이든! 똑똑한 하나봇'
              : '사용자 정보를 찾을 수 없습니다.'}
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)}>
          <Image
            src="/icons/Settings.svg"
            alt="설정"
            width={24}
            height={24}
            className="hover:opacity-80 transition"
          />
        </button>
      </div>

      {isModalOpen && (
        <ChatLanguageModal
          currentLang={defaultLang}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleLangChange}
        />
      )}
    </>
  );
}
