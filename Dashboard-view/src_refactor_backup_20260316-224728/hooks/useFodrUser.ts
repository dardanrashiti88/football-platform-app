import { useEffect, useState } from 'react';

const readUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('fodrUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function useFodrUser() {
  const [user, setUser] = useState<any | null>(() => readUser());

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'fodrUser') {
        setUser(readUser());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('fodr-user');
    const onMessage = () => setUser(readUser());
    channel.addEventListener('message', onMessage);
    return () => {
      channel.removeEventListener('message', onMessage);
      channel.close();
    };
  }, []);

  return user;
}

