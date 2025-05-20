'use client';

import { useState } from 'react';

interface StudentVerifyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentVerifyModal({ onClose, onSuccess }: StudentVerifyModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) setFile(uploaded);
  };

  const handleSubmit = () => {
    if (!file) return alert('파일을 업로드해주세요!');
    // 10분 인증 처리 시뮬레이션은 부모에서
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow">
        <h2 className="text-lg font-semibold text-center">재학생 인증</h2>

        <input
          id="verify-upload"
          type="file"
          onChange={handleUpload}
          className="text-sm"
        />
        <p className="text-sm text-gray-500">{file?.name || '선택된 파일 없음'}</p>

        <div className="flex justify-between pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-500 text-sm"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-sky-500 text-white rounded text-sm"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}
