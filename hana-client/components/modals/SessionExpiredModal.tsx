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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">
        <h2 className="text-lg font-bold mb-4">세션이 만료되었습니다</h2>
        <p className="text-sm mb-6">
          로그인 세션이 만료되었어요.<br />
          다시 로그인해주세요.
        </p>
        <button
          onClick={() => {
            onClose();
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className="w-full py-2 bg-sky-500 text-white rounded-md font-bold"
        >
          확인
        </button>
      </div>
    </div>
  );
}
