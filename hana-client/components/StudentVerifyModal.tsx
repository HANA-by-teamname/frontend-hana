'use client';

import { useState } from 'react';

interface StudentVerifyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentVerifyModal({
  onClose,
  onSuccess,
}: StudentVerifyModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSuccess?.(); // ✅ 함수인지 확인 후 호출
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg space-y-4">
        <h2 className="text-lg font-bold">재학생 인증</h2>

        {/* 파일 선택 버튼 */}
        <label className="block">
          <div className="cursor-pointer px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200">
            {selectedFile ? '파일 변경하기' : '파일 선택'}
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* 선택된 파일명 */}
        {selectedFile && (
          <p className="text-sm text-gray-700 truncate">{selectedFile.name}</p>
        )}

        {/* 버튼들 */}
        <div className="flex justify-between pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className="px-4 py-2 bg-sky-500 text-white text-sm rounded hover:bg-sky-600 disabled:opacity-50"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}
