import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading, onProductClick }) {
  if (loading) {
    return (
      <div id="product-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-[#E0C0B8]">
            <div className="skeleton aspect-[3/4]" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div id="product-grid" className="flex flex-col items-center justify-center py-20 text-center px-6">
        <p className="text-3xl mb-3">🛍️</p>
        <p className="font-medium text-[#1C1412] mb-1">No items here yet</p>
        <p className="text-[13px] text-[#7A5F5A]">Check back soon — new stock drops regularly!</p>
      </div>
    );
  }

  return (
    <div id="product-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 p-3">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
        />
      ))}
    </div>
  );
}
