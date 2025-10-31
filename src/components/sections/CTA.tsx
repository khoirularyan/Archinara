export default function CTA() {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Siap Memulai Proyek Anda?
        </h2>
        <p className="text-lg mb-8 text-white/90">
          Mari diskusikan ide-ide Anda dengan tim profesional kami
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#contact"
            className="bg-white text-slate-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Konsultasi Gratis
          </a>
          <a
            href="#projects"
            className="border-2 border-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
          >
            Lihat Portofolio
          </a>
        </div>
      </div>
    </section>
  );
}

