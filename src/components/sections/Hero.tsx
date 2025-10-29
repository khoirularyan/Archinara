import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section id="hero" className="pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Rancang Ruang Hidup Anda Dengan Profesional
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Wujudkan impian arsitektur Anda dengan tim profesional kami yang berpengalaman dalam menciptakan ruang yang indah dan fungsional.
            </p>
            <div className="flex gap-4">
              <a
                href="#projects"
                className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Lihat Detail
              </a>
              <a
                href="/pm"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="text-xs">🚀</span>
                <span>Coba Archinara PM</span>
              </a>
            </div>
          </div>
          <div>
            <img
              src="/images/tes.jpg"
              alt="Modern Architecture"
              className="rounded-lg w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

