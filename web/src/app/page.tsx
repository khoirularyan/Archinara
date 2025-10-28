"use client";

import { type RefObject } from "react";
import { useScrollAnimations, useCarousel } from "@/hooks";
import { Header, Footer } from "@/components/layout";
import { Hero, Projects, About, CTA, Testimonials, FAQ } from "@/components/sections";

export default function Home() {
  useScrollAnimations();
  const carouselRef = useCarousel();

  return (
    <>
      <Header />
      <Hero />
      <Projects />
      <About />
      <CTA />
      <Testimonials carouselRef={carouselRef as RefObject<HTMLDivElement>} />
      <FAQ />
      <Footer />
    </>
  );
}
