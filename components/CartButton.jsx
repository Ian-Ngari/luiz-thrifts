import { useRouter } from "next/router";
import { useCart } from "../lib/cartContext";

export default function CartButton() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <button
      onClick={() => router.push("/cart")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F5E8E4] transition-colors"
      title="View cart"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#1C1412]">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#C4877D] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
