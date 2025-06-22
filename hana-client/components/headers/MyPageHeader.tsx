'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SearchHeader() {
  const router = useRouter();

  const handleLikeClick = () => {
    router.push('/likes');
  };

  return (
    <div className="w-full px-6 py-4 shadow-sm flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">마이페이지</h2>
        <p className="text-sm text-gray-500"> 내 정보를 꾸미고 시간표를 등록해요 :) </p>
      </div>
    </div>
  );
}
