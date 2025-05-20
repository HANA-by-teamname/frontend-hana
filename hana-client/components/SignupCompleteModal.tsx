'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SignupCompleteModal() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setShow(false)}
    >
      <div
        className="w-[300px] h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src="/images/가입 완료 모달.png"
          alt="회원가입 완료 모달"
          width={300}
          height={300}
          priority
        />
      </div>
    </div>
  );
}
