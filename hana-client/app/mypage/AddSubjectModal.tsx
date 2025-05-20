'use client';

import { useState } from 'react';

interface AddSubjectModalProps {
  onAdd: (subject: any) => void;
  onClose: () => void;
}

const days = ['월', '화', '수', '목', '금'];
const times = Array.from({ length: 10 }, (_, i) => 9 + i); // 9 ~ 18

export default function AddSubjectModal({ onAdd, onClose }: AddSubjectModalProps) {
  const [form, setForm] = useState({
    name: '',
    day: '',
    start: '',
    end: '',
    professor: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.day || !form.start || !form.end) return;
    onAdd(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow space-y-4">
        <h2 className="text-lg font-semibold text-center">과목 추가하기</h2>

        <input
          name="name"
          placeholder="예: 경제학원론"
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
          <select name="start" value={form.start} onChange={handleChange} className="w-1/2 border px-3 py-2 text-sm rounded">
            <option value="">시작시간</option>
            {times.map((t) => (
              <option key={t} value={t}>{t}:00</option>
            ))}
          </select>
          <select name="end" value={form.end} onChange={handleChange} className="w-1/2 border px-3 py-2 text-sm rounded">
            <option value="">종료시간</option>
            {times.map((t) => (
              <option key={t} value={t}>{t}:00</option>
            ))}
          </select>
        </div>

        <input
          name="professor"
          placeholder="예: 김민지 교수님"
          value={form.professor}
          onChange={handleChange}
          className="w-full border px-3 py-2 text-sm rounded"
        />

        <input
          name="location"
          placeholder="예: 310관 205호"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 text-sm rounded"
        />

        <div className="flex justify-between pt-2">
          <button onClick={onClose} className="text-sm px-4 py-2 border rounded text-gray-500">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm px-4 py-2 bg-sky-500 text-white rounded"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
