import { useEffect } from "react";

export function useScrollAnimations() {
  useEffect(() => {
    // ===== Intersection Observer untuk elemen animasi =====
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10", "-translate-x-10", "translate-x-10", "scale-95");
            observer.unobserve(entry.target);
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    document.querySelectorAll(".animate-element").forEach((el) => observer.observe(el));

    // ===== Parallax untuk .parallax-element img =====
    let lastScrollY = window.scrollY;
    const parallaxElements = document.querySelectorAll<HTMLElement>(".parallax-element");

    const onScroll = () => {
      const scrollY = window.scrollY;
      const delta = (scrollY - lastScrollY) * 0.1;

      parallaxElements.forEach((el) => {
        const img = el.querySelector<HTMLImageElement>("img");
        if (!img) return;
        const currentTransform = img.style.transform || "translateY(0px)";
        const match = currentTransform.match(/translateY\(([-\d.]+)px\)/);
        const currentY = match && match[1] ? parseFloat(match[1]) : 0;
        const newY = Math.max(-50, Math.min(50, currentY + delta));
        img.style.transform = `translateY(${newY}px)`;
      });

      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}

