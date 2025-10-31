export default function About() {
  return (
    <section id="about" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/images/pic2.jpg"
              alt="About Us"
              className="rounded-lg w-full object-cover aspect-[4/3]"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Tentang Kami</h2>
            <p className="text-slate-600 mb-6">
              Archinara adalah studio arsitektur yang berdedikasi untuk menciptakan ruang yang memadukan
              estetika modern dengan fungsionalitas. Dengan pengalaman lebih dari 10 tahun, kami telah
              menyelesaikan berbagai proyek prestisius di seluruh Indonesia.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Visi</h4>
                <p className="text-slate-600">
                  Menjadi pionir dalam inovasi desain arsitektur yang berkelanjutan dan berwawasan masa depan.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Misi</h4>
                <p className="text-slate-600">
                  Menghadirkan solusi arsitektur yang mengutamakan keseimbangan antara estetika, fungsi, dan keberlanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

