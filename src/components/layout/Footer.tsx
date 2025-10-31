export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Archinara</h3>
            <p className="text-gray-300">Studio arsitektur modern yang menghadirkan solusi desain inovatif untuk ruang hidup Anda.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Jl. Kantil 4</li>
              <li>Depok, Sleman</li>
              <li>+62 21 1234 5678</li>
              <li>info@archinara.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Link</h4>
            <ul className="space-y-2">
              <li><a href="#projects" className="text-gray-300 hover:text-white transition-colors">Proyek</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Karir</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Sosial Media</h4>
            <div className="flex space-x-4 text-gray-300">
              <a href="http://instagram.com/archinara.co/" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="http://instagram.com/archinara.co/" className="hover:text-white transition-colors" aria-label="Twitter/X">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; 2024 Archinara. 22.11.4916 Khoirul Aryan Perdana.</p>
        </div>
      </div>
    </footer>
  );
}

