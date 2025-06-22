'use client';

import React from 'react';
import classNames from 'classnames';

interface Subject {
  name: string;
  day: string;             // 예: "월"
  start_time: string;      // 예: "09:00"
  end_time: string;        // 예: "10:15"
  professor?: string;
  location?: string;
}

interface TimetableProps {
  subjects: Subject[];
  onEdit?: (subject: Subject) => void;
}


const days = ['월', '화', '수', '목', '금'];
const timeSlots = Array.from({ length: 36 }, (_, i) => {
  const totalMinutes = 9 * 60 + i * 15; // 09:00 ~ 18:00
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const m = String(totalMinutes % 60).padStart(2, '0');
  return `${h}:${m}`;
});

const colorPalette = [
  'bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300',
  'bg-pink-300', 'bg-indigo-300', 'bg-orange-300', 'bg-teal-300', 'bg-emerald-300'
];

export default function Timetable({ subjects }: TimetableProps) {
  const getTimeIndex = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return ((h * 60 + m) - 540) / 15; // 540 = 9*60, 시작시간 offset
  };

  return (
    <div className="w-full border rounded-lg overflow-hidden text-xs">
      {/* Header */}
      <div className="grid grid-cols-6 border-b bg-gray-100 text-center font-semibold">
        <div className="py-2">시간</div>
        {days.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* 15분 단위 시간 줄 */}
      {timeSlots.map((time, i) => (
        <div key={time} className="grid grid-cols-6 border-b h-8 relative">
          {/* 시간 표시 */}
          <div className="flex items-center justify-center border-r text-gray-600">
            {time}
          </div>

          {/* 요일별 칸 */}
          {days.map((day, colIdx) => {
            const matched = subjects.find((s) =>
              s.day === day && getTimeIndex(s.start_time) === i
            );

            if (!matched) return <div key={day} />;

            const start = getTimeIndex(matched.start_time);
            const end = getTimeIndex(matched.end_time);
            const span = end - start;

            const bgColor = colorPalette[colIdx % colorPalette.length];

            return (
              <div
                key={day}
                className={classNames(
                  'absolute left-0 top-0 px-2 py-1 text-white text-xs rounded cursor-pointer',
                  bgColor
                )}
                style={{
                  gridColumn: colIdx + 2,
                  gridRow: i + 1,
                  height: `${span * 2}rem`, // 1칸 = 2rem
                  zIndex: 10,
                }}
                // 다음 단계: onClick으로 수정 모달 열기
              >
                <div className="font-semibold">{matched.name}</div>
                {matched.professor && <div className="text-[11px]">{matched.professor}</div>}
                {matched.location && <div className="text-[11px]">{matched.location}</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
