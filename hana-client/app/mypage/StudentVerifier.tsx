'use client';

import { useState } from 'react';
import StudentVerifyModal from '@/components/StudentVerifyModal';

export default function StudentVerifier() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 10 * 60 * 1000); // 10분 후 인증 완료
  };

  return (
    <div className="text-center space-y-2">
      {/* 아직 인증 전 */}
      {!isVerifying && !isVerified && (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#9ca3af] text-white text-sm rounded"
          >
            재학생 인증하기
          </button>

          {showModal && (
            <StudentVerifyModal
              onClose={() => setShowModal(false)}
              onSuccess={handleSuccess} // ✅ 꼭 전달!
            />
          )}
        </>
      )}

      {/* 인증 진행 중 */}
      {isVerifying && (
        <p className="text-sm text-yellow-600 font-medium">재학생 인증 중입니다...</p>
      )}

      {/* 인증 완료 */}
      {isVerified && (
        <button
          disabled
          className="px-4 py-2 bg-blue-700 text-gray-300 text-sm rounded cursor-not-allowed"
        >
          재학생 인증 완료
        </button>
      )}
    </div>
  );
}
