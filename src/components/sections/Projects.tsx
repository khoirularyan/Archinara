export default function Projects() {
  const projects = [
    { src: "/images/tes.jpg", title: "Interior Kamar Tidur" },
    { src: "/images/pic2.jpg", title: "Kitchen & Family room" },
    { src: "/images/pic3.jpg", title: "Kitchen & Family room" },
  ];

  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Proyek Unggulan
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <div key={i} className="group">
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={p.src}
                  alt={p.title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

