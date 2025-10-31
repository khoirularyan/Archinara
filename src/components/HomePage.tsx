"use client";

import { type RefObject } from "react";
import { useScrollAnimations, useCarousel } from "@/hooks";
import { Header } from "@/components/layout";
import {
  Hero,
  Projects,
  About,
  CTA,
  Testimonials,
  FAQ,
} from "@/components/sections";

export default function HomePage() {
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
    </>
  );
}
