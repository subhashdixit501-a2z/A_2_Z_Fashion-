import React from "react";

interface PWASplashScreenProps {
  show: boolean;
}

export function PWASplashScreen({
  show,
}: PWASplashScreenProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-600 text-white flex items-center justify-center text-xl font-black shadow-lg">
          A2Z
        </div>

        <h1 className="mt-5 text-xl font-black text-neutral-900">
          A_2_Z_Fashion
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Fashion • Deals • COD
        </p>

        <div className="mt-6 flex justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-neutral-200 border-t-rose-600 animate-spin" />
        </div>
      </div>
    </div>
  );
}
