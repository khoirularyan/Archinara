export default function PMHeader() {
  return (
    <header className="fixed w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/pm" className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">Archinara <span className="text-blue-600">PM</span></span>
            </a>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="/pm#features" className="text-gray-600 hover:text-slate-900 transition-colors">
                Fitur
              </a>
              <a href="/pm#pricing" className="text-gray-600 hover:text-slate-900 transition-colors">
                Harga
              </a>
              <a href="/pm/docs" className="text-gray-600 hover:text-slate-900 transition-colors">
                Dokumentasi
              </a>
              <a href="/pm/blog" className="text-gray-600 hover:text-slate-900 transition-colors">
                Blog
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-slate-900 transition-colors text-sm">
              ← Kembali ke Archinara
            </a>
            <a
              href="/pm/login"
              className="text-slate-900 hover:text-slate-700 transition-colors font-medium"
            >
              Masuk
            </a>
            <a
              href="/pm/signup"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Daftar Gratis
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
