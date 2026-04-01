import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";

const COUNTIES_DATA = {
  nairobi: {
    name: "Nairobi",
    description: "Premium thrift & secondhand clothes in Nairobi",
    keywords: "thrift clothes Nairobi, secondhand dresses Nairobi, mitumba Nairobi, designer thrift Nairobi",
    longDescription: "Shop curated secondhand and thrift fashion in Nairobi County. Quality designer dresses, thrift styles, and high-quality secondhand clothing at affordable prices.",
    deliveryTime: "Same day / Next day",
  },
  kisumu: {
    name: "Kisumu",
    description: "Thrift & secondhand clothes delivery in Kisumu",
    keywords: "thrift clothes Kisumu, secondhand fashion Kisumu, mitumba Kisumu, dresses Kisumu",
    longDescription: "Get quality secondhand and thrift clothes delivered to Kisumu. Premium mitumba fashion at affordable prices with fast delivery.",
    deliveryTime: "2-3 days",
  },
  nakuru: {
    name: "Nakuru",
    description: "Secondhand & thrift fashion in Nakuru, Kenya",
    keywords: "thrift clothes Nakuru, secondhand dresses Nakuru, mitumba Nakuru, fashion Nakuru",
    longDescription: "Discover curated thrift fashion in Nakuru County. High-quality secondhand clothes delivered right to you.",
    deliveryTime: "2-3 days",
  },
  mombasa: {
    name: "Mombasa",
    description: "Thrift clothes & secondhand fashion Mombasa",
    keywords: "thrift clothes Mombasa, secondhand Mombasa, mitumba Mombasa, dresses Mombasa",
    longDescription: "Premium thrift and secondhand fashion delivered to Mombasa. Quality clothes at pocket-friendly prices.",
    deliveryTime: "3-4 days",
  },
  eldoret: {
    name: "Eldoret",
    description: "Secondhand clothes & thrift fashion in Eldoret",
    keywords: "thrift clothes Eldoret, secondhand Eldoret, mitumba Eldoret, fashion Eldoret",
    longDescription: "Shop quality thrift clothes in Eldoret. Fast delivery of secondhand and designer fashion.",
    deliveryTime: "2-3 days",
  },
  kericho: {
    name: "Kericho",
    description: "Thrift & secondhand clothes in Kericho",
    keywords: "thrift clothes Kericho, secondhand Kericho, mitumba Kericho",
    longDescription: "Curated thrift fashion delivered to Kericho. Premium secondhand clothes at affordable prices.",
    deliveryTime: "2-3 days",
  },
  kisii: {
    name: "Kisii",
    description: "Secondhand dresses & thrift fashion Kisii",
    keywords: "thrift clothes Kisii, secondhand Kisii, mitumba Kisii, dresses Kisii",
    longDescription: "Shop thrift and secondhand fashion in Kisii County. Quality designer pieces delivered fast.",
    deliveryTime: "2-3 days",
  },
  machakos: {
    name: "Machakos",
    description: "Thrift clothes & secondhand fashion Machakos",
    keywords: "thrift clothes Machakos, secondhand Machakos, mitumba Machakos",
    longDescription: "Affordable secondhand and thrift fashion in Machakos. Premium quality clothes delivered to your door.",
    deliveryTime: "1-2 days",
  },
  kajiado: {
    name: "Kajiado",
    description: "Secondhand clothes & thrift in Kajiado",
    keywords: "thrift clothes Kajiado, secondhand Kajiado, mitumba Kajiado",
    longDescription: "Quality thrift fashion delivered to Kajiado. Shop premium secondhand clothes at great prices.",
    deliveryTime: "1-2 days",
  },
  kiambu: {
    name: "Kiambu",
    description: "Thrift & secondhand fashion in Kiambu",
    keywords: "thrift clothes Kiambu, secondhand Kiambu, mitumba Kiambu",
    longDescription: "Get quality thrift and secondhand clothes delivered to Kiambu County.",
    deliveryTime: "1-2 days",
  },
  murang_a: {
    name: "Murang'a",
    description: "Secondhand & thrift clothes Murang'a",
    keywords: "thrift clothes Murang'a, secondhand Murang'a, mitumba Murang'a",
    longDescription: "Premium thrift fashion in Murang'a. Affordable secondhand clothes with fast delivery.",
    deliveryTime: "1-2 days",
  },
  nyeri: {
    name: "Nyeri",
    description: "Thrift clothes & secondhand fashion Nyeri",
    keywords: "thrift clothes Nyeri, secondhand Nyeri, mitumba Nyeri",
    longDescription: "Shop curated thrift and secondhand fashion in Nyeri County.",
    deliveryTime: "1-2 days",
  },
};

const allCounties = [
  "nairobi", "kisumu", "nakuru", "mombasa", "eldoret", "kericho", "kisii",
  "machakos", "kajiado", "kiambu", "murang_a", "nyeri", "kirinyaga", "embu",
  "tharaka-nithi", "isiolo", "meru", "samburu", "laikipia", "baringo",
  "elgeyo-marakwet", "nandi", "bomet", "kakamega", "vihiga", "bungoma",
  "busia", "siaya", "homa-bay", "migori", "nyamira", "turkana", "west-pokot",
  "kilifi", "kwale", "lamu", "taita-taveta", "garissa", "wajir", "mandera",
  "marsabit", "tana-river", "narok", "trans-nzoia", "uasin-gishu", "mogotio"
];

export default function CountyDelivery() {
  const router = useRouter();
  const { county } = router.query;
  const countyData = COUNTIES_DATA[county] || { name: county?.replace("-", " ").toUpperCase(), description: `Thrift clothes delivery in ${county}` };

  if (!county) return null;

  const isAvailable = Object.keys(COUNTIES_DATA).includes(county);
  const title = `Thrift Clothes & Secondhand Fashion in ${countyData.name} | Luiz Mitumba Thrifts`;
  const description = countyData.longDescription || `Shop quality secondhand and thrift clothes delivered to ${countyData.name}. Premium mitumba fashion at affordable prices.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={countyData.keywords || `thrift clothes ${countyData.name}, secondhand fashion ${countyData.name}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://luizmitumbathrifts.co.ke/delivery/${county}`} />
      </Head>

      <div className="min-h-screen max-w-lg md:max-w-6xl mx-auto bg-white flex flex-col">
        <Navbar onAdminClick={() => {}} />

        <div className="flex-1 px-5 md:px-12 py-8">
          {/* Breadcrumb */}
          <button
            onClick={() => router.back()}
            className="text-[13px] text-[#7A5F5A] hover:text-[#1C1412] transition-colors mb-6 font-medium"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-[28px] text-[#1C1412] mb-2">
              Thrift Fashion in {countyData.name}
            </h1>
            <p className="text-[13px] text-[#7A5F5A] mb-4">
              {countyData.longDescription}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F5E8E4] rounded-lg border border-[#E0C0B8]">
                <p className="text-[10px] text-[#7A5F5A] uppercase tracking-wide mb-1">Delivery to {countyData.name.split(" ")[0]}</p>
                <p className="text-[13px] font-medium text-[#1C1412]">{countyData.deliveryTime}</p>
              </div>
              <div className="p-3 bg-[#F5E8E4] rounded-lg border border-[#E0C0B8]">
                <p className="text-[10px] text-[#7A5F5A] uppercase tracking-wide mb-1">Quality</p>
                <p className="text-[13px] font-medium text-[#1C1412]">Premium Thrift</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-[#F5E8E4] rounded-xl p-6 mb-8 border border-[#E0C0B8]">
            <h2 className="font-serif text-[18px] text-[#1C1412] mb-2">Ready to shop?</h2>
            <p className="text-[12px] text-[#7A5F5A] mb-4">
              Browse our collection and we'll deliver to your location in {countyData.name}.
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-[#1C1412] text-white text-[13px] font-medium py-3 rounded-lg hover:opacity-85 active:scale-95 transition-all"
            >
              Browse Collection
            </button>
          </div>

          {/* Why Choose Us */}
          <div className="space-y-3 mb-8">
            <h3 className="font-serif text-[16px] text-[#1C1412] mb-4">Why Luiz Mitumba Thrifts?</h3>
            {[
              { icon: "✨", title: "Curated Selection", desc: "Handpicked quality pieces" },
              { icon: "💰", title: "Affordable", desc: "Premium fashion at budget prices" },
              { icon: "🚚", title: "Fast Delivery", desc: `Delivered to ${countyData.name}` },
              { icon: "💬", title: "Easy Ordering", desc: "Order via WhatsApp instantly" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white border border-[#E0C0B8] rounded-lg">
                <span className="text-[18px]">{item.icon}</span>
                <div>
                  <p className="text-[12px] font-medium text-[#1C1412]">{item.title}</p>
                  <p className="text-[11px] text-[#7A5F5A]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* All Counties */}
          <div className="mb-8">
            <h3 className="font-serif text-[16px] text-[#1C1412] mb-3">Delivery to Other Counties</h3>
            <div className="grid grid-cols-2 gap-2">
              {allCounties.map((c) => (
                <button
                  key={c}
                  onClick={() => router.push(`/delivery/${c}`)}
                  className={`p-2 rounded-lg text-[11px] font-medium transition-all border
                    ${c === county
                      ? "bg-[#1C1412] text-white border-[#1C1412]"
                      : "bg-white border-[#E0C0B8] text-[#1C1412] hover:border-[#C4877D]"
                    }`}
                >
                  {c.replace(/-|_/g, " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
