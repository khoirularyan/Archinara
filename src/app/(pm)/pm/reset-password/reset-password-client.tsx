"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Token tidak ditemukan di URL");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // Validasi
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      setMessage(
        "Password berhasil direset! Anda akan diarahkan ke halaman login."
      );

      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        router.push("/pm/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Memverifikasi token...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Archinara <span className="text-blue-600">PM</span>
          </h1>
          <p className="text-slate-600">Reset Password</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {message ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Password Diperbarui!
              </h3>
              <p className="text-slate-600 mb-6">{message}</p>
              <Link
                href="/pm/login"
                className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Login Sekarang
              </Link>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Link Tidak Valid
              </h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <Link
                href="/pm/forgot-password"
                className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Minta Link Baru
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-slate-600 text-center">
                  Masukkan password baru Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Password Baru
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Minimal 6 karakter
                  </p>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Mereset..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/pm"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordClient() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
