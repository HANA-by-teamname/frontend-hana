'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [userName, setUserName] = useState('이유정');
  const [school, setSchool] = useState('중앙대학교');

  return (
    <main className="min-h-screen font-pretendard bg-[#F2F4FF]">
      <div className="w-[390px] mx-auto pb-20">
        {/* 상단 사용자 정보 및 설정 */}
        <div className="flex justify-between items-start px-6 pt-6">
          <div>
            <p className="text-sm text-[#4B4B4B]">안녕하세요, <span className="font-semibold">{userName}</span>님!</p>
            <h2 className="text-lg font-bold mt-1">{school}</h2>
          </div>
          <div className="flex gap-4 text-xl">
            <button>🔔</button>
            <button>⚙️</button>
          </div>
        </div>

        {/* 일정 알림 카드 */}
        <div className="px-6 mt-5 flex gap-2 overflow-x-scroll pb-2">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex-shrink-0 bg-white rounded-2xl px-4 py-3 shadow text-sm whitespace-nowrap">
              수강신청 정정기간<br />03.20 ~ 03.21
            </div>
          ))}
        </div>

        {/* 캘린더 미리보기 */}
        <section className="px-6 mt-6">
          <h3 className="text-sm font-semibold mb-2">이번주 우리 학교 일정</h3>
          <div className="bg-white rounded-2xl py-4 px-5 shadow text-center text-sm">
            📅 달력 컴포넌트 (예정)
          </div>
        </section>

        {/* 하단 배너 */}
        <div className="px-6 mt-6">
          <div className="bg-[#FFFAE0] rounded-2xl shadow-md p-5 text-sm text-center">
            <p className="font-semibold mb-1">너무 어려운 학교생활</p>
            <p className="text-xs text-[#666666]">챗봇에게 먼저 물어보세요</p>
          </div>
        </div>

        {/* 오늘의 학식 */}
        <section className="px-6 mt-6">
          <h3 className="text-sm font-semibold mb-2">오늘의 학식</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-2xl shadow p-4 text-xs leading-relaxed">
              🍱 310관 지하식당 점심<br />김치찌개, 순두부찌개, 치킨가스, 기름떡볶이, 두부무침, 잡채
            </div>
            <div className="bg-white rounded-2xl shadow p-4 text-xs leading-relaxed">
              🍱 310관 지하식당 저녁<br />돈까스, 계란말이, 된장국, 샐러드, 단무지
            </div>
          </div>
        </section>
      </div>

      {/* 하단 탭바 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t flex justify-around items-center py-2">
        <img src="/icons/home.svg" className="w-6 h-6" alt="홈" />
        <img src="/icons/search.svg" className="w-6 h-6" alt="검색" />
        <img src="/icons/like.svg" className="w-6 h-6" alt="찜" />
        <img src="/icons/user.svg" className="w-6 h-6" alt="마이페이지" />
      </nav>
    </main>
  );
}
