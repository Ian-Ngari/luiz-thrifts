import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../lib/cartContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "254798430650";

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

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState("front");
  const [side, setSide] = useState("L");
  const [size, setSize] = useState(null);
  const [imgOpacity, setImgOpacity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (queryError) throw queryError;
        if (!data) {
          setError(true);
          return;
        }

        setProduct(data);
        // Set initial side based on availability
        setSide(data.left_sold_out && !data.right_sold_out ? "R" : "L");
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | Luiz Mitumba Thrifts</title>
        </Head>
        <div className="min-h-screen max-w-lg mx-auto bg-white flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#E0C0B8] border-t-[#1C1412] rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Head>
          <title>Product Not Found | Luiz Mitumba Thrifts</title>
        </Head>
        <div className="min-h-screen max-w-lg mx-auto bg-white flex flex-col">
          <Navbar onAdminClick={() => {}} />
          <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
            <h2 className="text-[24px] font-serif text-[#1C1412] mb-2">Product Not Found</h2>
            <p className="text-[13px] text-[#7A5F5A] mb-6">This item may have been sold or removed.</p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#1C1412] text-white text-[13px] font-medium px-6 py-3 rounded-full hover:opacity-85 active:scale-95 transition-all"
            >
              Back to Shop
            </button>
          </div>
          <Footer />
        </div>
      </>
    );
  }

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

  function handleAddToCart() {
    if (canOrder) {
      addToCart(product, side, size);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  }

  const pageTitle = `${product.cat.charAt(0).toUpperCase() + product.cat.slice(1)} | Luiz Mitumba Thrifts`;
  const pageDescription = `Premium ${product.cat} - Quality thrift fashion in Nairobi. Left: KES ${product.left_price.toLocaleString()}, Right: KES ${product.right_price.toLocaleString()}. Order via WhatsApp.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={product.front_url} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={product.front_url} />
        <link rel="canonical" href={`https://luizmitumbathrifts.com/product/${id}`} />
      </Head>

      <div className="min-h-screen max-w-lg md:max-w-6xl mx-auto bg-white flex flex-col">
        <Navbar onAdminClick={() => {}} />

        <div className="flex-1 px-5 md:px-12 py-6">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="text-[13px] text-[#7A5F5A] hover:text-[#1C1412] transition-colors mb-4 font-medium"
          >
            ← Back
          </button>

          {/* Image Section */}
          <div className="mb-6">
            {/* View toggle */}
            <div className="flex gap-2 mb-3">
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

            {/* Image */}
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

          {/* Product Category */}
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#7A5F5A] mb-1">
            {product.cat}
          </p>

          {/* Price Section */}
          <h1 className="text-[24px] font-serif text-[#1C1412] mb-4">2 Outfits</h1>

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
              <div className="flex gap-2 flex-wrap mb-6">
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

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={!canOrder}
              className={`flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-medium text-[13px] transition-all duration-200
                ${canOrder
                  ? addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-[#1C1412] text-white hover:opacity-90 active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>{addedToCart ? "Added!" : "Add to Bag"}</span>
            </button>

            {/* Order on WhatsApp button */}
            <a
              href={canOrder ? buildWhatsAppLink(product, side, size) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-medium text-[13px] transition-all duration-200
                ${canOrder
                  ? "bg-[#25D366] text-white hover:opacity-90 active:scale-[0.98]"
                  : "bg-[#c8e8d4] text-[#7fbb95] cursor-not-allowed"
                }`}
              onClick={(e) => !canOrder && e.preventDefault()}
            >
              <WhatsAppIcon />
              <span>{currentInfo.soldOut ? "Sold out" : "Order Now"}</span>
            </a>
          </div>

          {/* View Cart section */}
          {addedToCart && (
            <button
              onClick={() => router.push("/cart")}
              className="w-full mb-6 py-2 border-2 border-[#1C1412] text-[#1C1412] rounded-lg font-medium text-[12px] hover:bg-[#1C1412] hover:text-white transition-all"
            >
              View Cart
            </button>
          )}

          {/* Share to WhatsApp */}
          <div className="mt-6 p-4 bg-[#F5E8E4] rounded-xl border border-[#E0C0B8]">
            <p className="text-[11px] font-medium text-[#7A5F5A] uppercase tracking-wide mb-2">
              Loved this? Share your order!
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hi%20Luiz%20Mitumba%20Thrifts%2C%20I%20just%20found%20this%20amazing%20${product.cat}!%20%F0%9F%94%A5%0Ahttps%3A%2F%2Fluizmitumbathrifts.com%2Fproduct%2F${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 transition-colors text-[12px] font-medium"
            >
              <WhatsAppIcon />
              Share screenshot
            </a>
          </div>

          {/* Product Info */}
          <div className="mt-8 space-y-3 pb-6">
            <div className="p-3 bg-[#F5E8E4] rounded-lg">
              <p className="text-[10px] text-[#7A5F5A] uppercase tracking-wide mb-1">Quality</p>
              <p className="text-[13px] font-medium text-[#1C1412]">Premium thrift from Kenya & internationals</p>
            </div>
            <div className="p-3 bg-[#F5E8E4] rounded-lg">
              <p className="text-[10px] text-[#7A5F5A] uppercase tracking-wide mb-1">Delivery</p>
              <p className="text-[13px] font-medium text-[#1C1412]">Countrywide delivery available</p>
            </div>
            <div className="p-3 bg-[#F5E8E4] rounded-lg">
              <p className="text-[10px] text-[#7A5F5A] uppercase tracking-wide mb-1">Order</p>
              <p className="text-[13px] font-medium text-[#1C1412]">Chat with us instantly on WhatsApp</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
