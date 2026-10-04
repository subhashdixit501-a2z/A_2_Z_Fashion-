import React, { useEffect, useState } from 'react';

export const PWASplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeAway, setFadeAway] = useState(false);

  useEffect(() => {
    // Only show on first mount or standalone launch
    const hasSeenSplash = sessionStorage.getItem('a2z_splash_shown');
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    // Show splash for 1.2s on standalone or 800ms on first web visit
    const duration = isStandalone ? 1200 : 700;

    const fadeTimer = setTimeout(() => {
      setFadeAway(true);
      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('a2z_splash_shown', 'true');
      }, 350);
    }, duration);

    return () => clearTimeout(fadeTimer);
  }, []);

  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#020617] text-white transition-opacity duration-300 pointer-events-none select-none ${
        fadeAway ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Centered Logo Badge */}
      <div className="relative flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="relative mb-5">
          <div className="absolute -inset-4 rounded-3xl bg-rose-500/20 blur-xl animate-pulse" />
          <img
            src="/pwa-192x192.png"
            alt="A_2_Z_Fashion"
            className="relative w-24 h-24 rounded-3xl shadow-2xl border border-rose-500/30 object-cover"
          />
        </div>

        <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-500 mb-1">
          A_2_Z_Fashion
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold mb-8">
          Curated Fashion Marketplace
        </p>

        {/* Minimal Android Splash Loading Bar */}
        <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full w-2/3 animate-[pulse_1s_infinite]" />
        </div>
      </div>

      {/* Powered by text at bottom */}
      <div className="absolute bottom-8 text-[11px] text-neutral-400 tracking-wider">
        MEESHO • FLIPKART • MYNTRA
      </div>
    </div>
  );
};
