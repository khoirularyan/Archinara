"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function PMHeader() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/pm/login" });
  };

  return (
    <header className="fixed w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/pm" className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">Archinara <span className="text-blue-600">PM</span></span>
            </Link>
            
            {status === "authenticated" && (
              <div className="hidden md:flex items-center gap-6">
                <Link href="/pm/dashboard" className="text-gray-600 hover:text-slate-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/pm/projects" className="text-gray-600 hover:text-slate-900 transition-colors">
                  Projects
                </Link>
                <Link href="/pm/team" className="text-gray-600 hover:text-slate-900 transition-colors">
                  Team
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" && (
              <div className="text-gray-500">Loading...</div>
            )}
            
            {status === "unauthenticated" && (
              <>
                <Link href="/" className="text-gray-600 hover:text-slate-900 transition-colors text-sm">
                  ← Kembali ke Archinara
                </Link>
                <Link
                  href="/pm/login"
                  className="text-slate-900 hover:text-slate-700 transition-colors font-medium"
                >
                  Masuk
                </Link>
                <Link
                  href="/pm/signup"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
            
            {status === "authenticated" && session?.user && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors"
                >
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium hidden md:block">{session.user.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      href="/pm/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Edit Profil
                    </Link>
                    <Link
                      href="/pm/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
