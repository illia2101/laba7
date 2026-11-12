import { useLayoutEffect } from "react";

export function useBioClamp(containerRef, deps) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const bios = [...container.querySelectorAll(".tutor-card__bio")];

      bios.forEach((bio) => bio.classList.remove("is-clamped"));

      const measurements = bios.map((bio) => ({
        bio,
        fullHeight: bio.offsetHeight,
      }));

      measurements.forEach(({ bio, fullHeight }) => {
        bio.classList.add("is-clamped");

        const card = bio.closest(".tutor-card");
        if (card) {
          card.classList.toggle("has-more", fullHeight > bio.offsetHeight + 1);
        }
      });
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, deps);
}
