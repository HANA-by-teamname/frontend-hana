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
        <h2 className="text-lg font-semibold text-gray-800 mb-1">검색</h2>
        <p className="text-sm text-gray-500">학교에 대한 정보를 빠르게 찾아보세요.</p>
      </div>
      <button onClick={handleLikeClick}>
        <Image
          src="/icons/Heart Filled.svg"
          alt="좋아요 리스트"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}
