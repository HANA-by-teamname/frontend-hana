// app/mypage/page.tsx

'use client';

import { useEffect, useState } from 'react';
import ProfileUploader from './ProfileUploader';
import StudentVerifier from './StudentVerifier';
import Timetable from './Timetable';
import AddSubjectModal from './AddSubjectModal';
import EditSubjectModal from './EditSubjectModal';
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
  start_time: string;
  end_time: string;
  professor?: string;
  location?: string;
}

export default function MyPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

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

  const fetchTimetable = async () => {
    try {
      const res = await authFetch('/timetable/list');
      if (!res.ok) throw new Error('시간표 불러오기 실패');
      const data = await res.json();
      const transformed = data.timetable.map((item: any) => ({
        name: item.subject,
        day: item.day,
        start_time: item.start_time,
        end_time: item.end_time,
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
    const interval = setInterval(() => {
      fetchTimetable();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubjectAdd = (subject: Subject) => {
    setSubjects((prev) => [...prev, subject]);
    setShowModal(false);
  };

  const handleSubjectUpdate = (updated: Subject) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.name === selectedSubject?.name &&
        s.day === selectedSubject?.day &&
        s.start_time === selectedSubject?.start_time
          ? updated
          : s
      )
    );
    setSelectedSubject(null);
  };

  const handleSubjectDelete = (deleted: Subject) => {
    setSubjects((prev) =>
      prev.filter(
        (s) =>
          !(
            s.name === deleted.name &&
            s.day === deleted.day &&
            s.start_time === deleted.start_time
          )
      )
    );
    setSelectedSubject(null);
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
        <section className="flex flex-col items-center gap-2">
          <ProfileUploader image={profileImage} onChange={setProfileImage} />
          <p className="text-base font-semibold text-center">{user?.nickname || '...'}</p>
          <p className="text-sm text-gray-500 text-center">{user?.faculty || '...'}</p>
        </section>

        <section>
          <StudentVerifier />
        </section>

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
          <Timetable subjects={subjects} onEdit={setSelectedSubject} />
        </section>
      </div>

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

      {showModal && (
        <AddSubjectModal
          onAdd={handleSubjectAdd}
          onClose={() => setShowModal(false)}
        />
      )}

      {selectedSubject && (
        <EditSubjectModal
          subject={{
            name: selectedSubject.name,
            day: selectedSubject.day,
            start_time: selectedSubject.start_time,
            end_time: selectedSubject.end_time,
            professor: selectedSubject.professor || '',
            location: selectedSubject.location || '',
          }}
          onClose={() => setSelectedSubject(null)}
          onUpdate={handleSubjectUpdate}
          onDelete={handleSubjectDelete}
        />
      )}

      <SessionExpiredModal
        visible={showSessionExpired}
        onClose={() => setShowSessionExpired(false)}
      />

      <FooterNav />
    </main>
  );
}
