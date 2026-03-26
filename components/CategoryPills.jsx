const CATEGORIES = [
  { id: "all",        label: "All",          active: true  },
  { id: "dresses",    label: "Dresses",      active: true  },
  { id: "tshirts",    label: "T-Shirts",     active: true  },
  { id: "tops",       label: "Tops",         active: false },
  { id: "jumpsuits",  label: "Jumpsuits",    active: false },
  { id: "skirts",     label: "Skirts",       active: false },
  { id: "trousers",   label: "Trousers",     active: false },
  { id: "jackets",    label: "Jackets",      active: false },
];

export default function CategoryPills({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-3 py-3 scrollbar-hide bg-white border-b border-[#E0C0B8] sticky top-14 z-30">
      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat.id;
        const isSoon = !cat.active;

        return (
          <button
            key={cat.id}
            disabled={isSoon}
            onClick={() => !isSoon && onChange(cat.id)}
            className={`
              whitespace-nowrap flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium
              border transition-all duration-200
              ${isSelected
                ? "bg-[#1C1412] text-white border-[#1C1412]"
                : isSoon
                  ? "opacity-35 border-gray-200 text-gray-400 cursor-default text-[10px]"
                  : "border-[#E0C0B8] text-[#7A5F5A] hover:border-[#C4877D] hover:text-[#1C1412] active:scale-95"
              }
            `}
          >
            {cat.label}{isSoon ? " · Soon" : ""}
          </button>
        );
      })}
    </div>
  );
}
