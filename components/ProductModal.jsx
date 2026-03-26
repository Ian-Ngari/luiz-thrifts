import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "25498430650";

function buildWhatsAppLink(product, side, size) {
  const info = side === "L"
    ? { price: product.left_price, label: "left" }
    : { price: product.right_price, label: "right" };

  const text = [
    `Hi! I'm interested in the *${info.label} outfit* from *Luiz Mitumba Thrifts* 🙏`,
    `Size: *${size}*`,
    `Price: *KES ${info.price.toLocaleString()}*`,
    `Is it still available?`,
  ].join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function ProductModal({ product, onClose }) {
  const [view, setView] = useState("front");
  const [side, setSide] = useState(
    product.left_sold_out && !product.right_sold_out ? "R" : "L"
  );
  const [size, setSize] = useState(null);
  const [imgOpacity, setImgOpacity] = useState(1);
  const startY = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => { setSize(null); }, [side]);

  const currentInfo = side === "L"
    ? { price: product.left_price, sizes: product.left_sizes, soldOut: product.left_sold_out }
    : { price: product.right_price, sizes: product.right_sizes, soldOut: product.right_sold_out };

  const currentImg = view === "front" ? product.front_url : product.back_url;
  const canOrder = !!size && !currentInfo.soldOut;

  function switchView(newView) {
    if (newView === view) return;
    setImgOpacity(0);
    setTimeout(() => {
      setView(newView);
      setImgOpacity(1);
    }, 200);
  }

  function onTouchStart(e) {
    startY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    if (startY.current && e.changedTouches[0].clientY - startY.current > 80) {
      onClose();
    }
    startY.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end overlay-fade"
      style={{ background: "rgba(20,12,10,.58)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto modal-slide"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-[#E0C0B8] rounded-full" />
        </div>

        {/* View toggle */}
        <div className="flex gap-2 px-4 mb-3">
          {["front", "back"].map((v) => (
            <button
              key={v}
              onClick={() => switchView(v)}
              className={`flex-1 py-2 rounded-lg text-[12px] font-medium border transition-all duration-200
                ${view === v
                  ? "bg-[#1C1412] text-white border-[#1C1412]"
                  : "border-[#E0C0B8] text-[#7A5F5A] hover:border-[#C4877D]"
                }`}
            >
              {v === "front" ? "Front view" : "Back view"}
            </button>
          ))}
        </div>

        {/* Photo */}
        <div className="px-4 mb-4">
          <div
            className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#F5E8E4]"
            style={{ opacity: imgOpacity, transition: "opacity 0.2s ease" }}
          >
            <Image
              src={currentImg}
              alt="Product photo"
              fill
              sizes="(max-width: 640px) 90vw, 400px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="px-4 pb-8">
          {/* Outfit selector */}
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#7A5F5A] mb-2">
            Choose outfit
          </p>

          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[
              { key: "L", label: "Left outfit", price: product.left_price, sizes: product.left_sizes, soldOut: product.left_sold_out },
              { key: "R", label: "Right outfit", price: product.right_price, sizes: product.right_sizes, soldOut: product.right_sold_out },
            ].map(({ key, label, price, sizes, soldOut }) => (
              <button
                key={key}
                onClick={() => !soldOut && setSide(key)}
                className={`p-3 rounded-xl text-left border-[1.5px] transition-all duration-200 relative overflow-hidden
                  ${soldOut
                    ? "border-gray-200 opacity-50 cursor-not-allowed"
                    : side === key
                      ? "border-[#C4877D] bg-[#F5E8E4]"
                      : "border-[#E0C0B8] hover:border-[#C4877D]"
                  }`}
              >
                {soldOut && (
                  <span className="absolute top-1.5 right-1.5 text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">
                    Sold out
                  </span>
                )}
                <p className="text-[11px] text-[#7A5F5A] mb-0.5">{label}</p>
                <p className={`text-[16px] font-semibold ${soldOut ? "text-gray-400 line-through" : "text-[#1C1412]"}`}>
                  KES {price.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#7A5F5A] mt-0.5">
                  {sizes.join(", ")}
                </p>
              </button>
            ))}
          </div>

          {/* Size selector */}
          {!currentInfo.soldOut && (
            <>
              <p className="text-[10px] font-medium uppercase tracking-widest text-[#7A5F5A] mb-2">
                Select size
              </p>
              <div className="flex gap-2 flex-wrap mb-5">
                {SIZES.map((s) => {
                  const available = currentInfo.sizes.includes(s);
                  const selected = size === s;

                  return (
                    <button
                      key={s}
                      disabled={!available}
                      onClick={() => available && setSize(size === s ? null : s)}
                      className={`px-4 py-2 rounded-lg border text-[13px] transition-all duration-200
                        ${selected
                          ? "bg-[#1C1412] text-white border-[#1C1412]"
                          : available
                            ? "border-[#E0C0B8] text-[#1C1412] hover:border-[#C4877D] active:scale-95"
                            : "border-[#E0C0B8] text-[#C4B0AB] line-through cursor-not-allowed opacity-40"
                        }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* WhatsApp CTA */}
          <a
            href={canOrder ? buildWhatsAppLink(product, side, size) : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-medium text-[14px] transition-all duration-200
              ${canOrder
                ? "bg-[#25D366] text-white hover:opacity-90 active:scale-[0.98]"
                : "bg-[#c8e8d4] text-[#7fbb95] cursor-not-allowed"
              }`}
            onClick={(e) => !canOrder && e.preventDefault()}
          >
            <WhatsAppIcon />
            {currentInfo.soldOut
              ? "This outfit is sold out"
              : canOrder
                ? `Order on WhatsApp · KES ${currentInfo.price.toLocaleString()}`
                : "Select a size first"}
          </a>
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}