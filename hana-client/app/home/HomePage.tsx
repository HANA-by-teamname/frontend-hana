'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SignupCompleteModal from '@/components/SignupCompleteModal';
import FooterNav from '@/components/FooterNav';
import CampusMap from '@/components/CampusMapWrapper';
import HomeHeader from '@/components/headers/HomeHeader';
import withAuth from '@/hoc/withAuth';
import { academicSchedules } from '@/lib/data/academicSchedules';
import { format, isWithinInterval, parseISO, isAfter, isToday } from 'date-fns';
import { authFetch } from '@/lib/api/authFetch';
import { USER_ME_ENDPOINT } from '@/lib/constants';
import { t } from '@/lib/utils/translate';
// 최상단 import 부분에 아래 추가:
import ForWorkSection from './ForWorkSection';

interface ClassInfo {
  time: string;
  subject: string;
  professor: string;
  location: string;
}

function HomePage() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [faculty, setFaculty] = useState<string | null>(null);
  const [nativeLanguage, setNativeLanguage] = useState<string>('ko');
  const [translateOn, setTranslateOn] = useState(false);
  const [todayClasses, setTodayClasses] = useState<ClassInfo[]>([]);

  const today = new Date();
  const upcomingSchedules = academicSchedules
    .filter(s => isAfter(parseISO(s.end), today) || isToday(parseISO(s.end)))
    .slice(0, 5);

  useEffect(() => {
    const saved = localStorage.getItem('translate');
    if (saved === 'true') setTranslateOn(true);

    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await authFetch(USER_ME_ENDPOINT);
        if (!res.ok) throw new Error('응답 오류');

        const data = await res.json();
        setUserName(data.nickname);
        setFaculty(data.faculty);
        setNativeLanguage(data.native_language);
      } catch (err) {
        console.error('사용자 정보 로딩 실패:', err);
      }
    };

    const fetchTodayClasses = async () => {
      const getKoreanDay = (date: Date): string => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[date.getDay()];
      };

      const todayKoreanDay = getKoreanDay(today);
      if (todayKoreanDay === '일' || todayKoreanDay === '토') {
        setTodayClasses([]);
        return;
      }

      try {
        const res = await authFetch('/timetable/list');
        if (!res.ok) throw new Error('시간표 불러오기 실패');
        const data = await res.json();
        const timetable = data.timetable;

        const classesToday = timetable
          .filter((cls: any) => cls.day === todayKoreanDay)
          .map((cls: any) => ({
            time: `${cls.start_time} ~ ${cls.end_time}`,
            subject: cls.subject,
            professor: `${cls.professor} ${t('교수님', nativeLanguage)}`,
            location: cls.location,
          }));

        setTodayClasses(classesToday);
      } catch (err) {
        console.error('❌ 오늘 강의 로딩 실패:', err);
      }
    };

    fetchUserInfo();
    fetchTodayClasses();

    if (searchParams.get('joined') === 'true') {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  }, [searchParams, translateOn]);

  return (
    <main className="min-h-screen font-pretendard bg-[#F9FAFB] pb-24">
      {showModal && <SignupCompleteModal />}

      {userName && faculty && (
        <HomeHeader
          userName={userName}
          faculty={translateOn ? t(faculty, nativeLanguage) : faculty}
          translateOn={translateOn}
          nativeLanguage={nativeLanguage}
          toggleTranslate={() => setTranslateOn(prev => !prev)} // ✅ 추가
        />
      )}

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[360px] space-y-6 px-4 pt-6 leading-[1.5]">

          {/* ✅ 학사일정 섹션 */}
          <section>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              {translateOn ? t('학사일정', nativeLanguage) : '학사일정'}
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {upcomingSchedules.map((schedule, i) => {
                const start = parseISO(schedule.start);
                const end = parseISO(schedule.end);
                const includesToday = isWithinInterval(today, { start, end });

                return (
                  <div
                    key={i}
                    className={`flex-shrink-0 w-[120px] h-[160px] rounded-xl p-4 shadow-sm border text-sm
                      ${includesToday
                        ? 'bg-blue-100 border-blue-400 text-blue-800 font-semibold'
                        : 'bg-gray-100 border-gray-200 text-gray-700'}
                    `}
                  >
                    <p className="mb-2">
                      {translateOn ? t(schedule.title, nativeLanguage) : schedule.title}
                    </p>
                    <p className="text-xs font-medium text-gray-500">
                      {format(start, 'MM.dd')} ~ {format(end, 'MM.dd')}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ✅ 지도 부분 삭제
          <section>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              {translateOn ? t('우리학교 지도', nativeLanguage) : '우리학교 지도'}
            </h3>
            <div className="rounded-md overflow-hidden shadow">
              <CampusMap />
            </div>
          </section> */}

          {/* ✅ 한국에서 취업하기 - ForWorkSection으로 교체 */}
          <ForWorkSection    
          nativeLanguage={nativeLanguage}
          translateOn={translateOn}  
          />

          {/* ✅ 오늘 강의 */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              {translateOn ? t('오늘 강의', nativeLanguage) : '오늘 강의'}
            </h3>
            {todayClasses.length === 0 ? (
              <p className="text-sm text-gray-500">
                {translateOn ? t('오늘 수업이 없어요.', nativeLanguage) : '오늘 수업이 없어요.'}
              </p>
            ) : (
              todayClasses.map((cls, index) => (
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
              ))
            )}
          </section>

          {/* ✅ 학식 */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              {translateOn ? t('오늘의 학식', nativeLanguage) : '오늘의 학식'}
            </h3>
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
                <p className="font-semibold mb-1 text-sky-500">
                  {translateOn ? t(meal.title, nativeLanguage) : meal.title}
                </p>
                <p>
                  {translateOn
                    ? meal.menu.split(', ').map((item) => t(item, nativeLanguage)).join(', ')
                    : meal.menu}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>

      <FooterNav nativeLanguage={nativeLanguage} translateOn={translateOn} />
    </main>
  );
}

export default withAuth(HomePage);
