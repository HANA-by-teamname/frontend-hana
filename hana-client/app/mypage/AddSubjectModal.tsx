'use client';

import { useState } from 'react';
import { authFetch } from '@/lib/api/authFetch';

interface AddSubjectModalProps {
  onAdd: (subject: any) => void;
  onClose: () => void;
}

const days = ['월', '화', '수', '목', '금'];
const times = Array.from({ length: 40 }, (_, i) => {
  const hour = Math.floor((540 + i * 15) / 60); // 540 = 9*60
  const minute = (i * 15) % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
});

export default function AddSubjectModal({ onAdd, onClose }: AddSubjectModalProps) {
  const [form, setForm] = useState({
    name: '',
    professor: '',
    location: '',
    times: [{ day: '', start: '', end: '' }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (index: number, field: string, value: string) => {
    setForm((prev) => {
      const updated = [...prev.times];
      updated[index][field as 'day' | 'start' | 'end'] = value;
      return { ...prev, times: updated };
    });
  };

  const addTimeBlock = () => {
    setForm((prev) => ({ ...prev, times: [...prev.times, { day: '', start: '', end: '' }] }));
  };

  const removeTimeBlock = (index: number) => {
    setForm((prev) => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const { name, professor, location, times } = form;

    if (!name || !professor || !location || times.some(t => !t.day || !t.start || !t.end)) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const createdSubjects: any[] = [];

      for (const t of times) {
        const res = await authFetch('/timetable/add', {
          method: 'POST',
          body: JSON.stringify({
            subject: name,
            day: t.day,
            start_time: t.start,
            end_time: t.end,
            professor,
            location,
          }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          alert(result.error || '저장 중 오류 발생');
          return;
        }

        createdSubjects.push(result.timetable);
      }

      // 여러 개 반환
      createdSubjects.forEach(onAdd);
      onClose();
    } catch (err) {
      alert('서버 요청 실패');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[22rem] shadow space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-center">과목 추가하기</h2>

        <input
          name="name"
          placeholder="예: 오픈소스SW프로젝트"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 text-sm rounded"
        />

        {form.times.map((block, idx) => (
          <div key={idx} className="space-y-1 border p-2 rounded bg-gray-50 relative">
            {form.times.length > 1 && (
              <button
                onClick={() => removeTimeBlock(idx)}
                className="absolute top-1 right-2 text-xs text-red-500"
              >
                ✕
              </button>
            )}
            <select
              value={block.day}
              onChange={(e) => handleTimeChange(idx, 'day', e.target.value)}
              className="w-full border px-3 py-2 text-sm rounded"
            >
              <option value="">요일 선택</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                value={block.start}
                onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                className="w-1/2 border px-3 py-2 text-sm rounded"
              >
                <option value="">시작</option>
                {times.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                value={block.end}
                onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                className="w-1/2 border px-3 py-2 text-sm rounded"
              >
                <option value="">종료</option>
                {times.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button
          onClick={addTimeBlock}
          className="w-full py-1 border rounded text-sm text-blue-500"
        >
          + 요일/시간 추가
        </button>

        <input
          name="professor"
          placeholder="예: 김영빈 교수님"
          value={form.professor}
          onChange={handleChange}
          className="w-full border px-3 py-2 text-sm rounded"
        />

        <input
          name="location"
          placeholder="예: 310관 727호"
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
