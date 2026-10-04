import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-[65] flex justify-center px-3">
      <div className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white shadow-lg">
        <WifiOff className="w-4 h-4" />

        <span className="text-xs font-bold">
          You are offline
        </span>
      </div>
    </div>
  );
}
