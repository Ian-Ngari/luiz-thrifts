import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar({ onAdminClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      } border-b border-[#E0C0B8]`}
    >
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#E0C0B8] flex-shrink-0 bg-[#F5E8E4]">
            <Image
  src="/logo.jpeg"
  alt="Luiz Mitumba Thrifts logo"
  width={36}
  height={36}
  className="object-cover rounded-full"
  priority
/>
          </div>

          <div>
            <p className="font-serif text-[15px] tracking-wide text-[#1C1412] leading-tight">
              Luiz Mitumba Thrifts
            </p>
            <p className="text-[9px] tracking-[2px] uppercase text-[#C4877D] leading-none">
              Premium Thrift · Nairobi
            </p>
          </div>
        </div>

        <button
          onClick={onAdminClick}
          className="text-[11px] font-medium px-3 py-1.5 border border-[#E0C0B8] rounded-lg text-[#7A5F5A] hover:bg-[#F5E8E4] hover:border-[#C4877D] transition-all duration-200 active:scale-95"
        >
          Admin ›
        </button>
      </div>
    </nav>
  );
}