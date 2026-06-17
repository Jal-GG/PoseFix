'use client';

import { useNetworkStatus } from '@/lib/pwa';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (!isOnline) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-600 px-4 py-2 text-center text-sm font-medium text-white">
        You are offline — session data will sync when reconnected
      </div>
    );
  }

  if (wasOffline) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-green-600 px-4 py-2 text-center text-sm font-medium text-white animate-pulse-slow">
        Back online — syncing your session data...
      </div>
    );
  }

  return null;
}
