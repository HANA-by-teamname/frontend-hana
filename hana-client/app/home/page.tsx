'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SignupCompleteModal from '@/components/SignupCompleteModal';
import FooterNav from '@/components/FooterNav';
import CampusMap from '@/components/CampusMapWrapper';
import HomeHeader from '@/components/headers/HomeHeader';

const todayClasses = [
  {
    time: '11:30 ~ 13:00',
    subject: '마케팅',
    professor: '서현석 교수님',
    location: '310관 205호',
  },
  {
    time: '15:00 ~ 16:15',
    subject: '회계원리',
    professor: '김민지 교수님',
    location: '101관 201호',
  },
];

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState<string | null>('이유정');
  const [school, setSchool] = useState<string | null>('중앙대학교');

  useEffect(() => {
    if (!userName || !school) {
      router.push('/login');
    }
  }, [userName, school, router]);

  useEffect(() => {
    if (searchParams.get('joined') === 'true') {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen font-pretendard bg-gray-50 pb-24">
      {showModal && <SignupCompleteModal />}

      {/* ✅ 분리된 헤더 사용 */}
      <HomeHeader userName={userName!} school={school!} />

      {/* 본문 */}
      <div className="w-full max-w-md mx-auto space-y-6 px-4 pt-6">

        {/* 학사일정 */}
        <section>
          <h3 className="text-sm font-semibold mb-3 text-gray-700">  학사일정</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 shadow-sm text-sm"
              >
                <p className="text-black font-semibold">수강신청 정정기간</p>
                <p className="text-xs text-gray-500">03.20 ~ 03.21</p>
              </div>
            ))}
          </div>
        </section>

        {/* 캠퍼스 지도 */}
        <section>
          <h3 className="text-sm font-semibold mb-3 text-gray-700">  우리학교 지도</h3>
          <div className="rounded-md overflow-hidden shadow">
            <CampusMap />
          </div>
        </section>

        {/* 오늘 강의 */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">  오늘 강의</h3>
          {todayClasses.map((cls, index) => (
            <div
              key={index}
              className="bg-white rounded-md p-4 shadow-sm text-sm space-y-1"
            >
              <p className="font-semibold">
                {cls.time} <span className="text-sky-500">{cls.subject}</span>
              </p>
              <p className="text-gray-700 text-xs">
                {cls.professor} · {cls.location}
              </p>
            </div>
          ))}
        </section>

        {/* 오늘의 학식 */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">  오늘의 학식</h3>
          {[{
            title: '310관 지하식당 점심',
            menu: '김치찌개, 순두부찌개, 치킨가스, 기름떡볶이, 두부무침, 잡채',
          }, {
            title: '303관 학생회관 점심',
            menu: '돈까스, 계란말이, 된장국, 샐러드, 단무지',
          }].map((meal, index) => (
            <div
              key={index}
              className="bg-white rounded-md p-4 shadow-sm text-xs leading-relaxed"
            >
              <p className="font-semibold mb-1 text-sky-500">{meal.title}</p>
              <p>{meal.menu}</p>
            </div>
          ))}
        </section>
      </div>

      <FooterNav />
    </main>
  );
}
