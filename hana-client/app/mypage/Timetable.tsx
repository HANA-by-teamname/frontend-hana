'use client';

import React from 'react';
import classNames from 'classnames';

interface Subject {
  name: string;
  day: string;       // 예: "월"
  start: string;     // 예: "9"
  end: string;       // 예: "11"
  professor?: string;
  location?: string;
}

interface TimetableProps {
  subjects: Subject[];
}

const days = ['월', '화', '수', '목', '금'];
const hours = Array.from({ length: 10 }, (_, i) => 9 + i); // 9~18

const colorPalette = [
  'bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300',
  'bg-pink-300', 'bg-indigo-300', 'bg-orange-300', 'bg-teal-300', 'bg-emerald-300'
];

export default function Timetable({ subjects }: TimetableProps) {
  return (
    <div className="w-full border rounded-lg overflow-hidden text-xs">
      {/* Header row */}
      <div className="grid grid-cols-6 border-b bg-gray-100 text-center font-semibold">
        <div className="py-2">시간</div>
        {days.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* 시간별 행 */}
      {hours.map((hour) => (
        <div key={hour} className="grid grid-cols-6 border-b h-16 relative">
          {/* 시간 표시 */}
          <div className="flex items-center justify-center border-r text-gray-600">
            {hour}:00
          </div>

          {/* 요일별 셀 */}
          {days.map((day, colIdx) => {
            // 이 셀에 들어갈 과목이 있는지 확인
            const matched = subjects.find((s) =>
              s.day === day &&
              parseInt(s.start) <= hour &&
              hour < parseInt(s.end)
            );

            if (!matched) return <div key={day} />;

            // 이 칸이 시작시간이 아니면 렌더링 X (중복 방지)
            if (parseInt(matched.start) !== hour) return null;

            const rowSpan = parseInt(matched.end) - parseInt(matched.start);
            const bgColor = colorPalette[colIdx % colorPalette.length];

            return (
              <div
                key={day}
                className={classNames(
                  'absolute left-0 top-0 px-2 py-1 text-white text-xs rounded',
                  bgColor
                )}
                style={{
                  gridColumn: colIdx + 2,
                  gridRow: hour - 8,
                  height: `${rowSpan * 4}rem`,
                }}
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
