'use client';

import { createContext, useContext, useRef, useState, useEffect } from 'react';

interface SessionModalInstance {
  showModal: () => void;
}

const SessionModalContext = createContext<{
  setInstance: (instance: SessionModalInstance | null) => void;
}>({
  setInstance: () => {},
});

let globalInstance: SessionModalInstance | null = null;

export function getSessionModalInstance() {
  return globalInstance;
}

export function SessionModalProvider({ children }: { children: React.ReactNode }) {
  const setInstance = (instance: SessionModalInstance | null) => {
    globalInstance = instance;
  };

  return (
    <SessionModalContext.Provider value={{ setInstance }}>
      {children}
    </SessionModalContext.Provider>
  );
}

export function useSessionModal() {
  return useContext(SessionModalContext);
}
