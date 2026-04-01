import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Navbar        from "../components/Navbar";
import Hero          from "../components/Hero";
import CategoryPills from "../components/CategoryPills";
import ProductGrid   from "../components/ProductGrid";
import AdminPanel    from "../components/AdminPanel";
import Footer        from "../components/Footer";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "254798430650";

function FloatingWhatsApp({ visible }) {
  const msg = encodeURIComponent("Hi! I'd like to ask about your clothing \uD83D\uDE4F");
  const href = "https://wa.me/" + WA_NUMBER + "?text=" + msg;

  return (
    <div
      className={[
        "fixed bottom-6 right-4 z-40 transition-all duration-500",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none",
      ].join(" ")}
    >
      {/* Pulse background */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping"></div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <WaIcon />
        <span className="text-[13px] font-medium">Chat with us</span>
      </a>
    </div>
  );
}

function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Home() {
  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [category,     setCategory]     = useState("all");
  const [showAdmin,    setShowAdmin]    = useState(false);
  const [waVisible,    setWaVisible]    = useState(false);

  useEffect(() => {
    const handler = () => setWaVisible(window.scrollY > 200);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const fetchProducts = useCallback(async (cat) => {
    setLoading(true);
    try {
      const url  = cat === "all" ? "/api/products" : "/api/products?cat=" + cat;
      const res  = await fetch(url);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load products:", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(category); }, [category, fetchProducts]);

  function handleProductAdded(newProd) {
    setProducts((prev) => [newProd, ...prev]);
  }

  function handleProductDeleted(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleProductUpdated(updated) {
    setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  }

  return (
    <>
      <Head>
        <title>Luiz Mitumba Thrifts — Premium Secondhand & Thrift Clothes in Nairobi, Kenya</title>
        <meta name="description" content="Shop premium mitumba & secondhand thrift clothes in Nairobi. High-quality designer dresses, fashion at affordable prices. Countrywide delivery across all 47 Kenya counties. Order via WhatsApp. Women's fashion, men's clothing, vintage styles." />
        <meta name="keywords" content="mitumba, secondhand clothes, thrift clothes, thrift shop, thrift fashion, mitumba clothes, secondhand dresses, designer thrift, affordable fashion, Nairobi fashion, Kenya thrift store, quality used clothes, vintage fashion, thrift dresses, thrift styles, secondhand fashion, sustainable fashion, eco-friendly clothing" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="author" content="Luiz Mitumba Thrifts" />
        <meta name="theme-color" content="#F5E8E4" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content="https://luizmitumbathrifts.com" />
        <meta property="og:title" content="Luiz Mitumba Thrifts — Premium Thrift Fashion in Nairobi" />
        <meta property="og:description" content="Curated secondhand fashion in Nairobi. Quality thrift finds at accessible prices. Order via WhatsApp. Countrywide delivery." />
        <meta property="og:image" content="https://luizmitumbathrifts.com/og-image.jpg" />
        <meta property="og:site_name" content="Luiz Mitumba Thrifts" />
        <meta property="og:locale" content="en_KE" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Luiz Mitumba Thrifts — Premium Secondhand Clothes" />
        <meta name="twitter:description" content="Shop premium mitumba & thrift clothes in Nairobi. High-quality dresses & fashion at affordable prices. Countrywide delivery." />
        <meta name="twitter:image" content="https://luizmitumbathrifts.com/og-image.jpg" />
        
        {/* Geo & Location Meta */}
        <meta name="geo.position" content="-1.2921,36.8219" />
        <meta name="geo.placename" content="Nairobi, Kenya" />
        <meta name="geo.region" content="KE-KA" />
        <meta name="ICBM" content="-1.2921, 36.8219" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="canonical" href="https://luizmitumbathrifts.com" />
        
        {/* Kenya Counties Schema  - for local SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Luiz Mitumba Thrifts",
            "description": "Premium secondhand and thrift clothing store in Nairobi, Kenya",
            "image": "https://luizmitumbathrifts.com/og-image.jpg",
            "url": "https://luizmitumbathrifts.com",
            "telephone": "+254798430650",
            "email": "info@luizmitumbathrifts.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Nairobi",
              "addressRegion": "Nairobi County",
              "addressCountry": "KE",
              "areaServed": [
                "Nairobi County", "Kiambu County", "Kajiado County", "Machakos County", "Makueni County",
                "Murang'a County", "Nyeri County", "Kirinyaga County", "Embu County", "Tharaka-Nithi County",
                "Isiolo County", "Meru County", "Samburu County", "Laikipia County", "Nakuru County",
                "Baringo County", "Elgeyo-Marakwet County", "Nandi County", "Kericho County", "Bomet County",
                "Kakamega County", "Vihiga County", "Bungoma County", "Busia County", "Siaya County",
                "Kisumu County", "Homa Bay County", "Migori County", "Kisii County", "Nyamira County",
                "Turkana County", "West Pokot County", "Kilifi County", "Mombasa County", "Kwale County",
                "Lamu County", "Taita-Taveta County", "Garissa County", "Wajir County", "Mandera County",
                "Marsabit County", "Tana River County", "Narok County", "Trans Nzoia County", "Uasin Gishu County",
                "Kericho County", "Mogotio"
              ]
            },
            "priceRange": "KES 350+",
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "08:00",
              "closes": "22:00"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "telephone": "+254798430650",
              "availableLanguage": ["en", "sw"]
            }
          })}
        </script>
        
        {/* E-commerce Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            "name": "Luiz Mitumba Thrifts",
            "description": "Online thrift and secondhand clothing store",
            "url": "https://luizmitumbathrifts.com",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "KES",
              "lowPrice": "350",
              "highPrice": "10000",
              "offerCount": "120+",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Head>

      <div className="min-h-screen max-w-lg md:max-w-6xl mx-auto bg-white relative">
        <Navbar onAdminClick={() => setShowAdmin(true)} />
        <Hero />
        <CategoryPills selected={category} onChange={setCategory} />
        <ProductGrid
          products={products}
          loading={loading}
        />
        <Footer />
      </div>

      <FloatingWhatsApp visible={waVisible} />

      {showAdmin && (
        <AdminPanel
          products={products}
          onClose={() => setShowAdmin(false)}
          onProductAdded={handleProductAdded}
          onProductDeleted={handleProductDeleted}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </>
  );
}