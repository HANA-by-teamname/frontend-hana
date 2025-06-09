'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';

const SessionModal = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    showModal: () => setOpen(true),
  }));

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 text-center shadow-lg w-[80%] max-w-xs">
        <p className="text-base font-semibold mb-4">세션이 만료되었습니다</p>
        <button
          onClick={() => (window.location.href = '/login')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          로그인 하러 가기
        </button>
      </div>
    </div>
  );
});

SessionModal.displayName = 'SessionModal';
export default SessionModal;
