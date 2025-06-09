'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authFetch } from '@/lib/api/authFetch';

interface User {
  name: string;
  faculty: string;
  native_language: string;
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch('/users/me');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('❌ 사용자 정보 조회 실패:', err);
        setUser(null); // authFetch에서 모달 뜸
      } finally {
        setLoading(false);
      }
    };

    // ✅ 브라우저 환경일 때만 실행 (서버에서는 localStorage 없음)
    if (typeof window !== 'undefined') {
      fetchUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
