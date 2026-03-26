import Image from "next/image";

export default function Hero() {
  const scrollToGrid = () => {
    document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#F5E8E4] px-5 pt-8 pb-9 text-center">
      <div className="flex justify-center mb-4">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
          <Image src="/logo.jpeg" alt="Luiz Mitumba Thrifts" fill className="object-cover" sizes="112px" priority />
        </div>
      </div>
      <p className="text-[10px] tracking-[3px] uppercase text-[#C4877D] font-medium mb-2">Fresh stock · Always rotating</p>
      <h1 className="font-serif text-[26px] leading-[1.2] text-[#1C1412] mb-2">Curated fashion,<br />accessible prices.</h1>
      <p className="text-[13px] text-[#7A5F5A] mb-6 leading-relaxed">Quality thrift finds in Nairobi. Order via WhatsApp instantly.</p>
      <div className="flex justify-center gap-7 mb-7">
        {[["120+", "Items"], ["KES 350+", "From"], ["Instant", "WhatsApp"]].map(([val, lbl]) => (
          <div key={lbl} className="text-center">
            <p className="font-serif text-[18px] text-[#1C1412]">{val}</p>
            <p className="text-[10px] text-[#7A5F5A] uppercase tracking-wider">{lbl}</p>
          </div>
        ))}
      </div>
      <button onClick={scrollToGrid} className="bg-[#1C1412] text-white text-[13px] font-medium px-6 py-3 rounded-full hover:opacity-85 active:scale-95 transition-all duration-200">
        Browse collection
      </button>
    </section>
  );
}