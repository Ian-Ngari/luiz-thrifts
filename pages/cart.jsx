import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../lib/cartContext";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "254798430650";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  function handleWhatsAppOrder() {
    if (!customerName || !customerPhone || !customerLocation) {
      alert("Please fill in your name, phone number, and location");
      return;
    }

    let orderText = `*LUIZ MITUMBA THRIFTS ORDER* 📦\n\n*Customer Details:*\nName: ${customerName}\nPhone: ${customerPhone}\nLocation: ${customerLocation}\n\n*Items:*\n`;

    cart.forEach((item) => {
      const price = item.side === "L" ? item.product.left_price : item.product.right_price;
      const sideLabel = item.side === "L" ? "Left" : "Right";
      orderText += `• ${item.product.cat} - ${sideLabel} outfit (Size ${item.size}) x${item.quantity} = KES ${(price * item.quantity).toLocaleString()}\n`;
    });

    orderText += `\n*Total: KES ${totalPrice.toLocaleString()}*\n\nPlease confirm this order. Thank you! 🙏`;

    const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(orderText)}`;
    window.open(waLink, "_blank");
    clearCart();
  }

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart | Luiz Mitumba Thrifts</title>
        </Head>
        <div className="min-h-screen max-w-lg mx-auto bg-white flex flex-col">
          <Navbar onAdminClick={() => {}} />
          <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
            <p className="text-[40px] mb-3">🛍️</p>
            <h2 className="font-serif text-[24px] text-[#1C1412] mb-2">Your cart is empty</h2>
            <p className="text-[13px] text-[#7A5F5A] mb-6">Add some amazing thrift finds to get started!</p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#1C1412] text-white text-[13px] font-medium px-6 py-3 rounded-full hover:opacity-85 active:scale-95 transition-all"
            >
              Continue Shopping
            </button>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart ({totalItems} items) | Luiz Mitumba Thrifts</title>
        <meta name="description" content="Review your Luiz Mitumba Thrifts order before checkout" />
      </Head>

      <div className="min-h-screen max-w-lg md:max-w-6xl mx-auto bg-white flex flex-col">
        <Navbar onAdminClick={() => {}} />

        <div className="flex-1 px-5 md:px-12 py-6">
          {/* Header */}
          <button
            onClick={() => router.back()}
            className="text-[13px] text-[#7A5F5A] hover:text-[#1C1412] transition-colors mb-4 font-medium"
          >
            ← Continue Shopping
          </button>

          <h1 className="font-serif text-[28px] md:text-[36px] text-[#1C1412] mb-6">Your Order</h1>

          {/* Cart Items */}
          <div className="space-y-3 mb-8">
            {cart.map((item) => {
              const price = item.side === "L" ? item.product.left_price : item.product.right_price;
              const sideLabel = item.side === "L" ? "Left" : "Right";

              return (
                <div key={item.itemId} className="flex gap-3 p-3 bg-[#F5E8E4] rounded-lg border border-[#E0C0B8]">
                  {/* Image */}
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={item.product.front_url}
                      alt={item.product.cat}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-[11px] text-[#7A5F5A] uppercase tracking-wide">{item.product.cat}</p>
                        <p className="text-[12px] font-medium text-[#1C1412]">{sideLabel} outfit</p>
                        <p className="text-[11px] text-[#7A5F5A]">Size {item.size}</p>
                      </div>
                      <p className="text-[13px] font-semibold text-[#1C1412]">KES {price.toLocaleString()}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-[#E0C0B8] text-[#7A5F5A] hover:bg-white transition-colors text-[12px]"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-[12px] font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-[#E0C0B8] text-[#7A5F5A] hover:bg-white transition-colors text-[12px]"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.itemId)}
                        className="ml-auto text-[11px] text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-[#F5E8E4] rounded-xl p-4 mb-6 border border-[#E0C0B8]">
            <div className="space-y-2 mb-3 pb-3 border-b border-[#E0C0B8]">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#7A5F5A]">Items: {totalItems}</span>
                <span className="text-[#1C1412] font-medium">KES {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#7A5F5A]">Delivery</span>
                <span className="text-[#1C1412] font-medium">Contact for quote</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-[#1C1412]">Total</span>
              <p className="text-[18px] font-semibold text-[#1C1412]">KES {totalPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-3 mb-6">
            <h2 className="text-[14px] font-medium text-[#1C1412]">Delivery Details</h2>
            <input
              type="text"
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E0C0B8] text-[13px] placeholder-[#C4B0AB] focus:outline-none focus:border-[#C4877D]"
            />
            <input
              type="tel"
              placeholder="Phone number (e.g., 0798430650)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E0C0B8] text-[13px] placeholder-[#C4B0AB] focus:outline-none focus:border-[#C4877D]"
            />
            <input
              type="text"
              placeholder="Location / Address"
              value={customerLocation}
              onChange={(e) => setCustomerLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E0C0B8] text-[13px] placeholder-[#C4B0AB] focus:outline-none focus:border-[#C4877D]"
            />
          </div>

          {/* WhatsApp CTA */}
          <button
            onClick={handleWhatsAppOrder}
            className="w-full flex items-center justify-center gap-2.5 mb-3 py-3.5 bg-[#25D366] text-white rounded-xl font-medium text-[14px] hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <WhatsAppIcon />
            Complete Order on WhatsApp
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-2.5 border border-[#E0C0B8] text-[#1C1412] rounded-lg font-medium text-[13px] hover:bg-[#F5E8E4] transition-colors"
          >
            Add More Items
          </button>

          <p className="text-[11px] text-[#7A5F5A] text-center mt-4">
            You'll complete payment through WhatsApp after confirming your order.
          </p>
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
