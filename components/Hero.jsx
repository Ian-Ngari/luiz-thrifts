import Image from "next/image";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "254798430650";

export default function Hero() {
  const scrollToGrid = () => {
    document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#F5E8E4] px-5 md:px-12 pt-8 md:pt-12 pb-9 md:pb-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
          <Image src="/logo.jpeg" alt="Luiz Mitumba Thrifts" fill className="object-cover" sizes="112px" priority />
        </div>
      </div>
      <p className="text-[10px] tracking-[3px] uppercase text-[#C4877D] font-medium mb-2">Fresh stock · Always rotating</p>
      <h1 className="font-serif text-[26px] md:text-[36px] leading-[1.2] text-[#1C1412] mb-2">Curated fashion,<br />accessible prices.</h1>
      <p className="text-[13px] md:text-[15px] text-[#7A5F5A] mb-6 leading-relaxed">Quality thrift finds in Nairobi. Order via WhatsApp instantly.</p>
      <div className="grid grid-cols-3 gap-3 mb-7">
        <div className="p-3 bg-white rounded-lg border border-[#E0C0B8] hover:border-[#C4877D] hover:shadow-sm transition-all">
          <div className="mb-2 flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4877D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/>
              <path d="M9 9h6v6H9z"/>
              <path d="M9 9L6 6M15 9l3-3M9 15l-3 3M15 15l3 3"/>
            </svg>
          </div>
          <p className="font-serif text-[16px] text-[#1C1412] mb-0.5">120+</p>
          <p className="text-[9px] text-[#7A5F5A] uppercase tracking-wide">Fresh Pieces</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-[#E0C0B8] hover:border-[#C4877D] hover:shadow-sm transition-all">
          <div className="mb-2 flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4877D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5m0 0H9.5a3.5 3.5 0 0 0 0 7H17"/>
              <circle cx="12" cy="12" r="1" fill="#C4877D"/>
            </svg>
          </div>
          <p className="font-serif text-[16px] text-[#1C1412] mb-0.5">KES 250+</p>
          <p className="text-[9px] text-[#7A5F5A] uppercase tracking-wide">Budget Friendly</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-[#E0C0B8] hover:border-[#C4877D] hover:shadow-sm transition-all">
          <div className="mb-2 flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4877D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <path d="M8 10h.01M12 10h.01M16 10h.01"/>
            </svg>
          </div>
          <p className="font-serif text-[16px] text-[#1C1412] mb-0.5">Instant</p>
          <p className="text-[9px] text-[#7A5F5A] uppercase tracking-wide">WhatsApp Orders</p>
        </div>
      </div>
      <button onClick={scrollToGrid} className="bg-[#1C1412] text-white text-[13px] font-medium px-6 py-3 rounded-full hover:opacity-85 active:scale-95 transition-all duration-200">
        Browse collection
      </button>

      {/* Share to WhatsApp Section */}
      <div className="mt-6 p-4 rounded-xl border border-[#E0C0B8] bg-white">
        <p className="text-[11px] font-medium text-[#7A5F5A] uppercase tracking-wide mb-2">
          ✨ Love what you find?
        </p>
        <p className="text-[12px] text-[#1C1412] font-medium mb-3">
          Share your order screenshot to WhatsApp & get style tips!
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=Hi%20Luiz%20Mitumba%20Thrifts%21%20I%20just%20found%20these%20amazing%20pieces%20on%20your%20store%20%F0%9F%94%A5%0Aplease%20check%20my%20screenshot%20%F0%9F%91%91`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366] text-white hover:opacity-90 active:scale-95 transition-all text-[12px] font-medium"
        >
          <WhatsAppIcon />
          Share screenshot on WhatsApp
        </a>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}