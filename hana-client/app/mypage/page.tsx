'use client';

import { useState } from 'react';
import ProfileUploader from './ProfileUploader';
import StudentVerifier from './StudentVerifier';
import Timetable from './Timetable';
import AddSubjectModal from './AddSubjectModal';
import Image from 'next/image';
import FooterNav from '@/components/FooterNav';
import MyPageHeader from '@/components/headers/MyPageHeader';

export default function MyPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]); // 이후 Subject 타입 정의 예정

  const handleSubjectAdd = (subject: any) => {
    setSubjects((prev) => [...prev, subject]);
    setShowModal(false);
  };

  return (
    <main className="min-h-screen font-pretendard bg-[#F9FAFB] pb-24 px-4">
     <MyPageHeader />
    <div className="w-full max-w-md mx-auto pt-6 space-y-6">
        {/* 프로필 */}
        <section className="flex flex-col items-center gap-2">
          <ProfileUploader image={profileImage} onChange={setProfileImage} />
          <p className="text-base font-semibold text-center">유댕댕댕</p>
          <p className="text-sm text-gray-500 text-center">중앙대학교</p>
        </section>

        {/* 재학생 인증 */}
        <section>
          <StudentVerifier />
        </section>

        {/* 시간표 */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">2025-1학기 나의 시간표</h3>
            <button onClick={() => setShowModal(true)}>
              <Image src="/icons/Add.svg" alt="Add" width={20} height={20} />
            </button>
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

      {/* Footer Navigation */}
      <FooterNav />
    </main>
  );
}