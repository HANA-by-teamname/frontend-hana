'use client';

import { useEffect, useState } from 'react';
import ProfileUploader from './ProfileUploader';
import StudentVerifier from './StudentVerifier';
import Timetable from './Timetable';
import AddSubjectModal from './AddSubjectModal';
import Image from 'next/image';
import FooterNav from '@/components/FooterNav';
import MyPageHeader from '@/components/headers/MyPageHeader';
import SessionExpiredModal from '@/components/modals/SessionExpiredModal';
import { authFetch } from '@/lib/api/authFetch';

interface UserInfo {
  nickname: string;
  faculty: string;
  profileImage?: string;
}

interface Subject {
  name: string;
  day: string;
  start: string;
  end: string;
  professor?: string;
  location?: string;
}

export default function MyPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // ✅ 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const res = await authFetch('/users/me');
      if (!res.ok) throw new Error('세션 만료');
      const data = await res.json();
      setUser({
        nickname: data.nickname,
        faculty: data.faculty,
        profileImage: data.profileImage || null,
      });
      setProfileImage(data.profileImage || '/images/puang.jpg');
    } catch (error) {
      console.error('❌ 사용자 정보 불러오기 실패:', error);
      setShowSessionExpired(true);
    }
  };

  // ✅ 시간표 가져오기
  const fetchTimetable = async () => {
    try {
      const res = await authFetch('/timetable/list');
      if (!res.ok) throw new Error('시간표 불러오기 실패');
      const data = await res.json();
      const transformed = data.timetable.map((item: any) => ({
        name: item.subject,
        day: item.day,
        start: item.start_time.split(':')[0],
        end: item.end_time.split(':')[0],
        professor: item.professor,
        location: item.location,
      }));
      setSubjects(transformed);
    } catch (err) {
      console.error('❌ 시간표 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchTimetable();

    // ✅ 3초마다 자동 새로고침
    const interval = setInterval(() => {
      fetchTimetable();
    }, 2000);

    // ✅ 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(interval);
  }, []);

  // ✅ 과목 추가 시 상태 업데이트
  const handleSubjectAdd = (subject: Subject) => {
    setSubjects((prev) => [...prev, subject]);
    setShowModal(false);
  };

  // ✅ 시간표 공유
  const handleShare = () => {
    const url = `${window.location.origin}/timetable/${user?.nickname}`;
    navigator.clipboard.writeText(url);
    alert('공유 링크가 복사되었어요!');
  };

  return (
    <main className="min-h-screen font-pretendard bg-[#F9FAFB] pb-24 px-4 pt-6">
      <MyPageHeader />
      <div className="w-full max-w-md mx-auto pt-6 space-y-6">
        {/* 프로필 */}
        <section className="flex flex-col items-center gap-2">
          <ProfileUploader image={profileImage} onChange={setProfileImage} />
          <p className="text-base font-semibold text-center">{user?.nickname || '...'}</p>
          <p className="text-sm text-gray-500 text-center">{user?.faculty || '...'}</p>
        </section>

        {/* 재학생 인증 */}
        <section>
          <StudentVerifier />
        </section>

        {/* 시간표 */}
        <section className="bg-white p-4 rounded-xl shadow border overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">2025-1학기 나의 시간표</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(true)}>
                <Image src="/icons/Add.svg" alt="Add" width={18} height={18} />
              </button>
              <button onClick={handleShare}>
                <Image src="/icons/Send.svg" alt="Share" width={18} height={18} />
              </button>
            </div>
          </div>
          <Timetable subjects={subjects} />
        </section>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="w-full max-w-md mx-auto mt-10 px-4">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="w-full py-3 text-sm bg-gray-200 text-gray-700 rounded"
        >
          로그아웃
        </button>
      </div>

      {/* 과목 추가 모달 */}
      {showModal && (
        <AddSubjectModal
          onAdd={handleSubjectAdd}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* 세션 만료 모달 */}
      <SessionExpiredModal
        visible={showSessionExpired}
        onClose={() => setShowSessionExpired(false)}
      />

      <FooterNav />
    </main>
  );
}
