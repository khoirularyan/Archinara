import { Accordion, type AccordionItem } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "Berapa lama proses desain rumah biasanya?",
      a: "Biasanya 4–8 minggu tergantung kompleksitas dan revisi.",
    },
    {
      q: "Apakah saya bisa revisi desain setelah selesai?",
      a: "Ya, kami menyediakan 2 kali revisi gratis per tahap. Lebihnya disepakati dulu.",
    },
    {
      q: "Apakah bisa konsultasi dulu sebelum memulai?",
      a: "Tentu! Konsultasi awal gratis untuk memahami kebutuhan Anda.",
    },
    {
      q: "Berapa biaya jasa desain rumah?",
      a: "Bervariasi tergantung luas, kompleksitas, dan paket. Penawaran diberikan setelah konsultasi.",
    },
    {
      q: "Apakah desain bisa disesuaikan dengan lahan yang saya miliki?",
      a: "Ya. Kami mempertimbangkan ukuran, bentuk, kontur, dan peraturan setempat.",
    },
  ];
  const items: AccordionItem[] = faqs.map((f, idx) => ({
    id: String(idx),
    header: f.q,
    content: f.a,
  }));

  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-navy mb-12 text-center animate-element opacity-0 translate-y-10 transition-all duration-700">
          Pertanyaan yang Sering Diajukan
        </h2>
        <Accordion items={items} className="max-w-3xl mx-auto" />
      </div>
    </section>
  );
}

