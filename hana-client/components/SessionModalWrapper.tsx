'use client';

import { useState, useRef, useEffect } from 'react';
import SessionExpiredModal from '@/components/modals/SessionExpiredModal';
import { useSessionModal } from '@/contexts/SessionModalContext';
import { setSessionModalInstance } from '@/lib/sessionModalInstance';

export default function SessionModalWrapper() {
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<{ showModal: () => void }>(null);
  const { setInstance } = useSessionModal();

  useEffect(() => {
    const controller = {
      showModal: () => setVisible(true),
    };
    setInstance(controller);
    setSessionModalInstance(controller);
  }, []);

  return (
    <SessionExpiredModal
      visible={visible}
      onClose={() => setVisible(false)}
    />
  );
}
