'use client';

import { useState } from 'react';
import Image from 'next/image';

const markers = [
  { id: '101관', top: '60%', left: '25%' },
  { id: '204관', top: '55%', left: '43%' },
  { id: '310관', top: '28%', left: '78%' },
];

export default function CampusMapImage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="px-6">
      <div className="relative w-full aspect-[19/5] rounded-xl overflow-hidden shadow-md bg-gray-100">
        <Image
          src="/images/campus-map-flat.png"
          alt="캠퍼스 지도"
          fill
          className="object-cover"
          priority
        />

        {markers.map((marker) => {
          const isActive = marker.id === '310관'; // 예시 기준 수업 있음 표시
          return (
            <button
              key={marker.id}
              onClick={() => setSelected(marker.id)}
              className={`absolute w-5 h-5 rounded-full shadow border border-white transition ${
                isActive ? 'bg-yellow-400 hover:bg-yellow-500 ring-2 ring-yellow-600' : 'bg-blue-500 hover:bg-blue-700'
              }`}
              style={{ top: marker.top, left: marker.left }}
              title={marker.id}
            >
              <span className="sr-only">{marker.id}</span>
            </button>
          );
        })}

        {selected && (
          <div
            className="absolute text-white text-xs px-3 py-1 rounded-md shadow animate-fadeIn bg-black/70"
            style={{ top: 'calc(100% - 1.5rem)', left: '50%', transform: 'translateX(-50%)' }}
          >
            {selected}
          </div>
        )}
      </div>
    </div>
  );
}
