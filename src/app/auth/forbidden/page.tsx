'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function ForbiddenPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
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
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Access Denied
        </h1>
        
        <p className="text-slate-600 mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>

        {session?.user && (
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600">
              Login sebagai: <span className="font-semibold">{session.user.email}</span>
            </p>
            <p className="text-sm text-slate-600">
              Role: <span className="font-semibold">{session.user.role}</span>
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/pm"
            className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="block w-full bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
