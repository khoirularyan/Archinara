import { type RefObject } from "react";

interface TestimonialsProps {
  carouselRef: RefObject<HTMLDivElement>;
}

export default function Testimonials({ carouselRef }: TestimonialsProps) {
  const testimonials = [
    {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      text: "Tim Archinara sangat profesional dalam menerjemahkan visi kami menjadi desain yang indah dan fungsional.",
    },
    {
      name: "David Chen",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      text: "Hasil desain rumah kami melebihi ekspektasi. Archinara berhasil menciptakan ruang yang nyaman dan estetis.",
    },
    {
      name: "Maria Garcia",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      text: "Proses desain bersama Archinara sangat menyenangkan. Mereka mendengarkan kebutuhan kami dan memberi solusi kreatif.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-navy mb-12 text-center animate-element opacity-0 translate-y-10 transition-all duration-700">
          Apa Kata Klien Kami
        </h2>

        <div className="relative">
          <div id="testimonialCarousel" ref={carouselRef} className="overflow-hidden">
            <div className="flex transition-transform duration-500 carousel-content">
              {testimonials.map((testimonial, n) => (
                <div key={n} className="w-full lg:w-1/3 flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-slate-200 h-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-navy">{testimonial.name}</h4>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">{testimonial.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            <button className="w-2.5 h-2.5 rounded-full bg-navy/70 hover:bg-navy transition-colors" data-index="0" />
            <button className="w-2.5 h-2.5 rounded-full bg-navy/70 hover:bg-navy transition-colors" data-index="1" />
            <button className="w-2.5 h-2.5 rounded-full bg-navy/70 hover:bg-navy transition-colors" data-index="2" />
          </div>
        </div>
      </div>
    </section>
  );
}

