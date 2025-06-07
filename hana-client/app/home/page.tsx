'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SignupCompleteModal from '@/components/SignupCompleteModal';
import FooterNav from '@/components/FooterNav';
import CampusMap from '@/components/CampusMapWrapper';
import HomeHeader from '@/components/headers/HomeHeader';
import withAuth from '@/hoc/withAuth';

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

function HomePage() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [faculty, setFaculty] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:4000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('응답 오류');

        const data = await res.json();
        setUserName(data.nickname);
        setFaculty(data.faculty);
      } catch (err) {
        console.error('사용자 정보 로딩 실패:', err);
      }
    };

    fetchUserInfo();

    if (searchParams.get('joined') === 'true') {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen font-pretendard bg-[#F9FAFB] pb-24">
      {showModal && <SignupCompleteModal />}

      {/* ✅ 헤더 */}
      {userName && faculty && (
        <div className="w-full flex justify-center pt-[24px]">
          <div className="w-full max-w-[360px] px-4">
            <HomeHeader userName={userName} faculty={faculty} />
          </div>
        </div>
      )}

      {/* ✅ 본문 */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[360px] space-y-6 px-4 pt-6 leading-[1.5]">
          <section>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">학사일정</h3>
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

          <section>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">우리학교 지도</h3>
            <div className="rounded-md overflow-hidden shadow">
              <CampusMap />
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">오늘 강의</h3>
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

          <section className="space-y-3">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">오늘의 학식</h3>
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
      </div>

      <FooterNav />
    </main>
  );
}

export default withAuth(HomePage);
