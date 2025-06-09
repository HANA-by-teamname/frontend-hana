'use client';

import { useRouter } from 'next/navigation';

interface SessionExpiredModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SessionExpiredModal({ visible, onClose }: SessionExpiredModalProps) {
  const router = useRouter();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      {/* ✅ 아래 div가 정확히 정중앙에 뜨게 수정됨 */}
      <div className="bg-white px-5 py-4 rounded-xl w-80 text-center shadow-lg animate-fade-in">
        <p className="text-sm text-gray-700 mb-4">
          로그인 세션이 만료되었어요.<br />
          다시 로그인해주세요.
        </p>
        <button
          onClick={() => {
            onClose();
            localStorage.removeItem('token');
            router.push('/users/login');
          }}
          className="w-full py-2 bg-sky-500 text-white rounded-md font-semibold"
        >
          확인하고 로그인하기
        </button>
      </div>
    </div>
  );
}
