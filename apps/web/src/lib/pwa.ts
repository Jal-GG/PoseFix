'use client';

import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [pendingData, setPendingData] = useState<unknown[]>([]);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setTimeout(() => setWasOffline(false), 3000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function queueData(data: unknown) {
    setPendingData((prev) => [...prev, data]);
    try {
      const existing = JSON.parse(localStorage.getItem('posefix_queue') || '[]');
      existing.push({ data, timestamp: Date.now() });
      localStorage.setItem('posefix_queue', JSON.stringify(existing));
    } catch {}
  }

  async function syncPending() {
    const stored = localStorage.getItem('posefix_queue');
    if (!stored) return;
    try {
      const items = JSON.parse(stored);
      for (const item of items) {
        try {
          await fetch('/api/sessions/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          });
        } catch {}
      }
      localStorage.removeItem('posefix_queue');
      setPendingData([]);
    } catch {}
  }

  useEffect(() => {
    if (isOnline && wasOffline) {
      syncPending();
    }
  }, [isOnline, wasOffline]);

  return { isOnline, wasOffline, pendingData, queueData };
}
