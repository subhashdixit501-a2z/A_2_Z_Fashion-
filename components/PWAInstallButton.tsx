import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface PWAInstallButtonProps {
  onClose?: () => void;
}

export function PWAInstallButton({
  onClose,
}: PWAInstallButtonProps) {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    await installPrompt.userChoice;

    setInstallPrompt(null);
    setVisible(false);
    onClose?.();
  };

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:w-80 z-[60]">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-black">
              Install A_2_Z_Fashion
            </h3>

            <p className="text-xs text-neutral-500 mt-1 leading-5">
              Add the app to your home screen for quick access.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleInstall}
          className="mt-3 w-full h-10 rounded-xl bg-neutral-950 text-white text-xs font-black"
        >
          Install App
        </button>
      </div>
    </div>
  );
}
