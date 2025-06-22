'use client';

import { useState } from 'react';
import { authFetch } from '@/lib/api/authFetch';

interface Subject {
  name: string;
  day: string;
  start_time: string;
  end_time: string;
  professor: string;
  location: string;
}

interface EditSubjectModalProps {
  subject: Subject;
  onClose: () => void;
  onUpdate: (newSubject: Subject) => void;
  onDelete: (deletedSubject: Subject) => void;
}

const days = ['월', '화', '수', '목', '금'];
const times = Array.from({ length: 40 }, (_, i) => {
  const hour = Math.floor((540 + i * 15) / 60);
  const minute = (i * 15) % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
});

export default function EditSubjectModal({ subject, onClose, onUpdate, onDelete }: EditSubjectModalProps) {
  const [form, setForm] = useState<Subject>({ ...subject });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form.name || !form.day || !form.start_time || !form.end_time || !form.professor || !form.location) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await authFetch('/timetable/delete', {
        method: 'DELETE',
        body: JSON.stringify({
          subject: subject.name,
          day: subject.day,
          start_time: subject.start_time,
        }),
      });

      const res = await authFetch('/timetable/add', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.error || '수정 중 오류 발생');
        return;
      }

      onUpdate(result.timetable);
      onClose();
    } catch (err) {
      console.error('❌ 수정 실패:', err);
      alert('수정 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm('정말 삭제하시겠어요?');
    if (!confirmed) return;

    try {
      const res = await authFetch('/timetable/delete', {
        method: 'DELETE',
        body: JSON.stringify({
          subject: subject.name,
          day: subject.day,
          start_time: subject.start_time,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.error || '삭제 중 오류 발생');
        return;
      }

      onDelete(subject);
      onClose();
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('삭제 요청 실패');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow space-y-4">
        <h2 className="text-lg font-semibold text-center">과목 수정하기</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 text-sm rounded"
        />

        <select name="day" value={form.day} onChange={handleChange} className="w-full border px-3 py-2 text-sm rounded">
          <option value="">요일 선택</option>
          {days.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <select name="start_time" value={form.start_time} onChange={handleChange} className="w-1/2 border px-3 py-2 text-sm rounded">
            <option value="">시작</option>
            {times.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select name="end_time" value={form.end_time} onChange={handleChange} className="w-1/2 border px-3 py-2 text-sm rounded">
            <option value="">종료</option>
            {times.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <input
          name="professor"
          value={form.professor}
          onChange={handleChange}
          className="w-full border px-3 py-2 text-sm rounded"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 text-sm rounded"
        />

        <div className="flex justify-between pt-2">
          <button onClick={handleDelete} className="text-sm px-4 py-2 border rounded text-red-500">
            삭제
          </button>
          <button onClick={onClose} className="text-sm px-4 py-2 border rounded text-gray-500">
            취소
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="text-sm px-4 py-2 bg-sky-500 text-white rounded"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
