import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50 flex items-center justify-between gap-3 rounded-2xl bg-neutral-900/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-rose-200 border border-rose-500/30 shadow-2xl animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
        </span>
        <WifiOff className="w-4 h-4 text-rose-400" />
        <span>Offline Mode — Showing cached A_2_Z_Fashion catalog</span>
      </div>
    </div>
  );
};
