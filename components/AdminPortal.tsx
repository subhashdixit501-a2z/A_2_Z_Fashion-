import React, { useState } from "react";
import { X, Shield, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AdminPortalProps {
  onClose: () => void;
}

export function AdminPortal({ onClose }: AdminPortalProps) {
  const { user, isAdmin, loading, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoginLoading(true);

    try {
      await login(email.trim(), password);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-black">Admin Portal</h2>
              <p className="text-xs text-neutral-500">
                A_2_Z_Fashion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="py-10 text-center text-sm text-neutral-500">
              Checking admin session...
            </div>
          ) : isAdmin ? (
            <div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-sm font-black text-emerald-700">
                  Admin login successful
                </p>

                <p className="text-xs text-emerald-700/80 mt-1">
                  {user?.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="p-3 rounded-xl bg-neutral-50">
                  <p className="text-[10px] text-neutral-500">
                    Access
                  </p>
                  <p className="text-sm font-black mt-1">
                    Admin
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50">
                  <p className="text-[10px] text-neutral-500">
                    Authentication
                  </p>
                  <p className="text-sm font-black mt-1">
                    Firebase
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-5 w-full h-11 rounded-xl border border-neutral-200 font-bold text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold">
                  Admin Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-400"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-11 rounded-xl bg-neutral-950 text-white font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                {loginLoading ? "Signing in..." : "Admin Login"}
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                Only the authorized Firebase admin account can access
                protected admin features.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
