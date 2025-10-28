export default function Header() {
  return (
    <header className="fixed w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <a href="#hero" className="text-2xl font-bold text-slate-900">
            Archinara
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-gray-600 hover:text-slate-900 transition-colors">
              Beranda
            </a>
            <a href="#projects" className="text-gray-600 hover:text-slate-900 transition-colors">
              Proyek
            </a>
            <a href="#about" className="text-gray-600 hover:text-slate-900 transition-colors">
              Tentang Kami
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-slate-900 transition-colors">
              Testimonial
            </a>
            <a href="#contact" className="text-gray-600 hover:text-slate-900 transition-colors">
              Kontak
            </a>
            <a
              href="#contact"
              className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Hubungi Kami
            </a>
          </div>

          <button className="md:hidden text-gray-600" aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}

