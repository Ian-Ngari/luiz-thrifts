import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

function isNew(createdAt) {
  if (!createdAt) return false;
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 7;
}

export default function ProductCard({ product, index }) {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);

  const bothSoldOut = product.left_sold_out && product.right_sold_out;
  const newItem     = isNew(product.created_at);

  const handleClick = () => {
    if (!bothSoldOut) {
      router.push(`/product/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`card-enter rounded-xl overflow-hidden border border-[#E0C0B8] bg-white transition-all duration-300
        ${bothSoldOut
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer group hover:-translate-y-1.5 hover:shadow-md hover:border-[#C4877D] active:scale-[0.98]"
        }`}
      style={{ animationDelay: `${Math.min(index * 0.07, 0.4)}s` }}
    >
      {/* Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-[#F5E8E4]">
        {!imgLoaded && <div className="skeleton absolute inset-0" />}
        <Image
          src={product.front_url}
          alt={`${product.cat} listing`}
          fill
          sizes="(max-width: 640px) 50vw, 300px"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 img-fade ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadingComplete={() => setImgLoaded(true)}
        />

        {/* Sold out overlay */}
        {bothSoldOut && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-[#1C1412] text-white text-[11px] font-medium px-3 py-1.5 rounded-full tracking-wider uppercase">
              Sold out
            </span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {newItem && !bothSoldOut && (
            <span className="bg-[#C4877D] text-white text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
              New ✦
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-medium px-2 py-0.5 rounded-full text-[#7A5F5A] uppercase tracking-wider">
            {product.cat}
          </span>
        </div>

        {/* Partial sold-out badges (one side still available) */}
        {!bothSoldOut && (product.left_sold_out || product.right_sold_out) && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full">
              {product.left_sold_out ? "L sold out" : "R sold out"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-[10px] text-[#7A5F5A] uppercase tracking-wide mb-1">2 outfits</p>
        <div className="flex gap-1.5 flex-wrap">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
            product.left_sold_out
              ? "bg-gray-100 text-gray-400 line-through"
              : "bg-[#EDD3CC] text-[#1C1412]"
          }`}>
            L · KES {product.left_price.toLocaleString()}
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
            product.right_sold_out
              ? "bg-gray-100 text-gray-400 line-through"
              : "bg-[#EDD3CC] text-[#1C1412]"
          }`}>
            R · KES {product.right_price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}