'use client';

import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { deleteTimetable } from '@/lib/api/timetable';

interface TimetableDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subjectName: string;
  subjectData: {
    name: string;
    day: string;
    start_time: string;
  };
}

export default function TimetableDeleteModal({
  visible,
  onClose,
  onConfirm,
  subjectName,
  subjectData,
}: TimetableDeleteModalProps) {
  const handleDelete = async () => {
    try {
      await deleteTimetable(subjectData);
      onConfirm(); // 실제 상태 반영
      setTimeout(() => {
        window.location.reload(); // 1.5초 뒤 새로고침
      }, 1500);
    } catch (err) {
      alert('삭제 중 오류 발생');
      console.error(err);
    }
  };

  return (
    <Dialog open={visible} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <Dialog.Panel className="bg-white rounded-lg p-6 shadow-md w-80">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {`"${subjectName}" 과목을 삭제하시겠어요?`}
          </Dialog.Title>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
