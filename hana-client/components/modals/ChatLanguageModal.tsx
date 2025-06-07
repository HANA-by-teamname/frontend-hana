'use client';

import { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface ChatLanguageModalProps {
  currentLang: string | null;
  onClose: () => void;
  onConfirm: (newLang: string) => void;
}

const LANGUAGES = [
  { value: 'ko', label: '한국어 / Korean / 韩语' },
  { value: 'en', label: '영어 / English / 英语' },
  { value: 'zh', label: '중국어 / Chinese / 中文' },
  { value: 'ja', label: '일본어 / Japanese / 日语' },
  { value: 'vi', label: '베트남어 / Vietnamese / 越南语' },
];

export default function ChatLanguageModal({
  currentLang,
  onClose,
  onConfirm,
}: ChatLanguageModalProps) {
  const [selectedLang, setSelectedLang] = useState(currentLang || '');
  const [saving, setSaving] = useState(false);

  const isChanged = selectedLang !== currentLang;

  const handleSave = async () => {
    if (!isChanged) return;
    setSaving(true);
    await onConfirm(selectedLang);
    setSaving(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-80 relative">
          {/* X 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3"
            aria-label="닫기"
          >
            <img src="/icons/Close.svg" alt="닫기" className="w-5 h-5" />
          </button>

          <h3 className="text-lg font-semibold mb-4 text-gray-800">언어 설정</h3>
          <ul className="space-y-2">
            {LANGUAGES.map((lang) => {
              const isDefault = lang.value === currentLang;
              const isSelected = lang.value === selectedLang;

              return (
                <li
                  key={lang.value}
                  onClick={() => !isDefault && setSelectedLang(lang.value)}
                  className={`cursor-pointer flex items-center justify-between px-3 py-2 rounded-md
                    ${isDefault ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}
                    ${isSelected && !isDefault ? 'border border-blue-500' : ''}`}
                >
                  <span>{lang.label}</span>
                  {isDefault && <CheckIcon className="w-4 h-4 text-gray-400" />}
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleSave}
            disabled={!isChanged || saving}
            className={`mt-6 w-full px-4 py-2 rounded-lg text-white font-semibold transition
              ${isChanged && !saving ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {saving ? '저장 중...' : '확인'}
          </button>
        </div>
      </div>
    </>
  );
}
