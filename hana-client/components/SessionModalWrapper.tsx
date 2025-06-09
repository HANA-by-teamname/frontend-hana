'use client';

import { useRef, useEffect } from 'react';
import SessionModal from './SessionModal';
import { useSessionModal } from '@/contexts/SessionModalContext';

export default function SessionModalWrapper() {
  const modalRef = useRef<{ showModal: () => void }>(null);
  const { setInstance } = useSessionModal();

  useEffect(() => {
    if (modalRef.current) {
      setInstance(modalRef.current); // 🔑 여기 중요
    }
  }, []);

  return <SessionModal ref={modalRef} />;
}
