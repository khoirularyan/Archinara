import { useEffect, useRef } from "react";

export function useCarousel() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<NodeListOf<HTMLButtonElement> | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    const content = carousel?.querySelector<HTMLDivElement>(".carousel-content");
    const slides = content ? Array.from(content.children) as HTMLElement[] : [];
    dotsRef.current = document.querySelectorAll<HTMLButtonElement>("[data-index]");

    const updateCarousel = () => {
      if (!content || slides.length === 0) return;
      const firstSlide = slides[0];
      if (!firstSlide) return;
      const slideWidth = firstSlide.getBoundingClientRect().width;
      content.style.transform = `translateX(-${currentIndexRef.current * slideWidth}px)`;
      dotsRef.current?.forEach((dot, idx) => {
        dot.style.opacity = idx === currentIndexRef.current ? "1" : "0.5";
      });
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayRef.current = setInterval(() => {
        currentIndexRef.current = (currentIndexRef.current + 1) % slides.length;
        updateCarousel();
      }, 5000);
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };

    // init
    updateCarousel();
    startAutoplay();

    // dots click
    dotsRef.current?.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        currentIndexRef.current = idx;
        updateCarousel();
        startAutoplay();
      });
    });

    // touch swipe
    let touchStartX = 0;
    carousel?.addEventListener("touchstart", (e) => {
      const touch = e.changedTouches[0];
      if (touch) touchStartX = touch.screenX;
    }, { passive: true });

    carousel?.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      const touchEndX = touch.screenX;
      const diff = touchStartX - touchEndX;
      const swipeThreshold = 50;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentIndexRef.current < slides.length - 1) currentIndexRef.current++;
        else if (diff < 0 && currentIndexRef.current > 0) currentIndexRef.current--;
        updateCarousel();
        startAutoplay();
      }
    }, { passive: true });

    // resize handler
    let resizeTimeout: NodeJS.Timeout | null = null;
    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCarousel, 100);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      stopAutoplay();
    };
  }, []);

  return carouselRef;
}

