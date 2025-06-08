'use client';

import { useEffect, useState } from 'react';
import ProfileUploader from './ProfileUploader';
import StudentVerifier from './StudentVerifier';
import Timetable from './Timetable';
import AddSubjectModal from './AddSubjectModal';
import Image from 'next/image';
import FooterNav from '@/components/FooterNav';
import MyPageHeader from '@/components/headers/MyPageHeader';

interface UserInfo {
  nickname: string;
  faculty: string;
  profileImage?: string;
}

export default function MyPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser({
        nickname: data.nickname,
        faculty: data.faculty,
        profileImage: data.profileImage || null,
      });
      if (!data.profileImage) {
        setProfileImage('/images/puang.jpg');
      } else {
        setProfileImage(data.profileImage);
      }
    };
    fetchUserInfo();
  }, []);

  const handleSubjectAdd = (subject: any) => {
    setSubjects((prev) => [...prev, subject]);
    setShowModal(false);
  };

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
        <section className="bg-white p-4 rounded-xl shadow border">
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

      <FooterNav />
    </main>
  );
}
