"use client";

import { useEffect } from "react";

export function MobileNav() {
  useEffect(() => {
    const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
    const nav = document.querySelector<HTMLElement>(".site-header__nav");
    if (!toggle || !nav) return;

    const onToggle = () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", onToggle);
    return () => toggle.removeEventListener("click", onToggle);
  }, []);

  return null;
}
