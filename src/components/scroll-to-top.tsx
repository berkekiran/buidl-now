"use client";

import { useState, useEffect } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="w-[640px] mx-auto px-6 py-12 flex justify-end">
        <button
          onClick={scrollToTop}
          className={`pointer-events-auto p-2 bg-[#1a1a1a] text-muted-foreground rounded border border-border hover:bg-[#222222] transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] cursor-pointer ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label="Scroll to top"
        >
          <MdKeyboardArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
