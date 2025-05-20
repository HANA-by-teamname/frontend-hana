'use client';

import { useRef } from 'react';

interface ProfileUploaderProps {
  image: string | null;
  onChange: (base64: string) => void;
}

export default function ProfileUploader({ image, onChange }: ProfileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label
        htmlFor="profileUpload"
        className="cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {image ? (
          <img
            src={image}
            alt="프로필"
            className="w-20 h-20 rounded-full object-cover border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300" />
        )}
      </label>
      <input
        ref={inputRef}
        id="profileUpload"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
