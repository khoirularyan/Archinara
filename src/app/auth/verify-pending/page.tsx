'use client'

import { useState, Suspense } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function VerifyPendingContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')

  const [email, setEmail] = useState(emailParam || '')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Email harus diisi')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setMessageType('success')
      } else {
        setMessage(data.error || 'Gagal mengirim email')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Resend error:', error)
      setMessage('Terjadi kesalahan. Silakan coba lagi.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Verifikasi Email Anda
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Kami telah mengirimkan link verifikasi ke email Anda. 
          Silakan cek inbox atau folder spam.
        </p>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Langkah-langkah:
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Buka email dari Archinara PM</li>
            <li>Klik tombol "Verifikasi Email"</li>
            <li>Anda akan diarahkan ke halaman login</li>
          </ol>
        </div>

        {/* Resend Form */}
        <form onSubmit={handleResend} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Anda
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {messageType === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                messageType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message}
              </p>
            </div>
          )}

          {/* Resend Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Kirim Ulang Email
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Sudah verifikasi?
          </p>
          <Link
            href="/pm/login"
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
          >
            Login ke Dashboard →
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Tidak menerima email? Cek folder spam atau tunggu beberapa menit.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyPendingContent />
    </Suspense>
  )
}
