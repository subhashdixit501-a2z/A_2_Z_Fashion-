import React, { useState } from 'react';
import { Download, Sparkles, X, Smartphone, Share, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // If already running as an installed PWA, do not render install prompts
  if (isInstalled) {
    return null;
  }

  // Header Button Variant
  if (variant === 'header') {
    if (isInstallable) {
      return (
        <button
          onClick={install}
          className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-900/20 hover:shadow-rose-600/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
          title="Install A_2_Z_Fashion app on your device"
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-200 group-hover:animate-bounce" />
          <span>Install App</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>
      );
    }

    if (isIOS) {
      return (
        <>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Install on</span> iOS
          </button>

          {showIOSGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-neutral-100 text-neutral-900">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/pwa-192x192.png" alt="A_2_Z_Fashion" className="w-8 h-8 rounded-lg shadow-xs" />
                    <h3 className="font-bold text-sm">Install A_2_Z_Fashion</h3>
                  </div>
                  <button
                    onClick={() => setShowIOSGuide(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 text-xs text-neutral-600">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-50">
                    <div className="w-6 h-6 rounded-lg bg-neutral-200 flex items-center justify-center shrink-0 font-bold text-neutral-800">
                      1
                    </div>
                    <p className="pt-0.5">
                      Tap the <strong className="text-neutral-900 inline-flex items-center gap-1"><Share className="w-3 h-3" /> Share</strong> button in Safari's bottom toolbar.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-50">
                    <div className="w-6 h-6 rounded-lg bg-neutral-200 flex items-center justify-center shrink-0 font-bold text-neutral-800">
                      2
                    </div>
                    <p className="pt-0.5">
                      Scroll down and tap <strong className="text-neutral-900">Add to Home Screen</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-50 text-rose-800">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <p>Launches in full-screen standalone mode without the browser address bar!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-5 w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
                >
                  Got It
                </button>
              </div>
            </div>
          )}
        </>
      );
    }

    return null;
  }

  // Mobile Bottom Banner Variant
  if (variant === 'banner') {
    if (bannerDismissed || (!isInstallable && !isIOS)) {
      return null;
    }

    return (
      <aside
        aria-label="App installation prompt"
        className="fixed bottom-3 left-3 right-3 sm:hidden z-40 bg-gradient-to-r from-neutral-950 via-slate-900 to-neutral-950 text-white rounded-2xl p-3 shadow-2xl border border-rose-500/30 flex items-center gap-3 animate-in slide-in-from-bottom-4"
      >
        <img
          src="/pwa-192x192.png"
          alt="A_2_Z_Fashion Icon"
          className="w-11 h-11 rounded-xl shadow-md border border-rose-500/40 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-xs text-white truncate">A_2_Z_Fashion App</h4>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-500/20 text-rose-300 font-semibold">PWA</span>
          </div>
          <p className="text-[11px] text-neutral-400 truncate">
            Fast, fullscreen Android shopping experience
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isInstallable && (
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-transform"
            >
              Install
            </button>
          )}
          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              Add
            </button>
          )}
          <button
            onClick={() => setBannerDismissed(true)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            title="Dismiss install banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  return null;
};
