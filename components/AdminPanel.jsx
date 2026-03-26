import { useState, useRef } from "react";
import Image from "next/image";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const CATEGORIES = [
  { id: "dresses",   label: "Dresses"   },
  { id: "tshirts",   label: "T-Shirts"  },
  { id: "tops",      label: "Tops"      },
  { id: "jumpsuits", label: "Jumpsuits" },
  { id: "skirts",    label: "Skirts"    },
  { id: "trousers",  label: "Trousers"  },
  { id: "jackets",   label: "Jackets"   },
];

const EMPTY_FORM = {
  cat: "dresses",
  leftPrice: "",  leftSizes: [],
  rightPrice: "", rightSizes: [],
};

export default function AdminPanel({
  products,
  onClose,
  onProductAdded,
  onProductDeleted,
  onProductUpdated,
}) {
  const [tab,         setTab]         = useState("add");
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [frontFile,   setFrontFile]   = useState(null);
  const [backFile,    setBackFile]    = useState(null);
  const [frontPrev,   setFrontPrev]   = useState(null);
  const [backPrev,    setBackPrev]    = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [password,    setPassword]    = useState("");
  const [authed,      setAuthed]      = useState(false);
  const [authErr,     setAuthErr]     = useState("");
  const [msg,         setMsg]         = useState(null);

  const frontRef = useRef();
  const backRef  = useRef();

  // ── Auth gate ──────────────────────────────────────────
  if (!authed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overlay-fade px-5">
        <div className="bg-white rounded-2xl p-6 w-full max-w-xs">
          <p className="font-serif text-[18px] text-[#1C1412] mb-1">Admin access</p>
          <p className="text-[12px] text-[#7A5F5A] mb-5">Enter your admin password to continue.</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setAuthErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && tryAuth()}
            className="w-full border border-[#E0C0B8] rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-[#C4877D] mb-3"
          />
          {authErr && <p className="text-[12px] text-red-500 mb-3">{authErr}</p>}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#E0C0B8] rounded-lg text-[13px] text-[#7A5F5A]"
            >
              Cancel
            </button>
            <button
              onClick={tryAuth}
              disabled={authLoading}
              className="flex-1 py-2.5 bg-[#1C1412] text-white rounded-lg text-[13px] font-medium disabled:opacity-50"
            >
              {authLoading ? "Checking…" : "Enter"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Auth (SECURE - backend check) ──────────────────────
  async function tryAuth() {
    if (!password.trim()) {
      setAuthErr("Please enter a password.");
      return;
    }

    setAuthLoading(true);
    setAuthErr("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "x-admin-password": password },
      });

      if (res.status === 401) {
        setAuthErr("Incorrect password. Try again.");
        setPassword("");
      } else if (res.ok) {
        setAuthed(true);
      } else {
        setAuthErr("Something went wrong. Try again.");
      }
    } catch {
      setAuthErr("Connection error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  // ── Helpers ────────────────────────────────────────────
  function pickFile(which, file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (which === "front") { setFrontFile(file); setFrontPrev(url); }
    else                   { setBackFile(file);  setBackPrev(url);  }
  }

  function toggleSize(side, s) {
    const key   = side === "L" ? "leftSizes" : "rightSizes";
    const sizes = form[key];
    setForm((f) => ({
      ...f,
      [key]: sizes.includes(s) ? sizes.filter((x) => x !== s) : [...sizes, s],
    }));
  }

  function flash(text, type) {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  }

  // ── Add listing ────────────────────────────────────────
  async function handleSubmit() {
    if (!frontFile || !backFile)
      return flash("Please upload both front and back photos.", "error");
    if (!form.leftPrice || !form.rightPrice)
      return flash("Please enter prices for both outfits.", "error");
    if (!form.leftSizes.length || !form.rightSizes.length)
      return flash("Please select sizes for both outfits.", "error");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("front", frontFile);
      fd.append("back",  backFile);

      const upRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: fd,
      });
      if (!upRes.ok) throw new Error("Image upload failed.");
      const { front, back } = await upRes.json();

      const prodRes = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          cat: form.cat,
          front_url: front.url,
          back_url: back.url,
          front_public_id: front.public_id,
          back_public_id: back.public_id,
          left_price: parseInt(form.leftPrice),
          left_sizes: form.leftSizes,
          right_price: parseInt(form.rightPrice),
          right_sizes: form.rightSizes,
          left_sold_out: false,
          right_sold_out: false,
        }),
      });

      if (!prodRes.ok) throw new Error("Failed to save product.");
      const newProd = await prodRes.json();

      onProductAdded(newProd);
      setForm(EMPTY_FORM);
      setFrontFile(null); setFrontPrev(null);
      setBackFile(null);  setBackPrev(null);
      flash("Listing added to the store! ✓", "ok");
      setTab("manage");
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  // ── Delete listing ─────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm("Remove this listing? This cannot be undone.")) return;
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    if (res.ok) { onProductDeleted(id); flash("Listing removed.", "ok"); }
    else flash("Delete failed.", "error");
  }

  // ── Toggle sold out ────────────────────────────────────
  async function handleToggleSoldOut(id, field, value) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      const updated = await res.json();
      onProductUpdated(updated);
      flash(`Marked as ${value ? "sold out" : "available"}.`, "ok");
    } else {
      flash("Update failed.", "error");
    }
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto overlay-fade">

      {/* Header */}
      <div className="sticky top-0 bg-[#1C1412] text-white px-4 h-14 flex items-center justify-between z-10">
        <p className="font-medium text-[14px]">Admin Panel</p>
        <button
          onClick={onClose}
          className="text-[12px] border border-white/30 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors"
        >
          Close ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E0C0B8]">
        {[["add", "Add listing"], ["manage", `Manage (${products.length})`]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 text-[13px] font-medium transition-colors ${
              tab === key
                ? "border-b-2 border-[#C4877D] text-[#1C1412]"
                : "text-[#7A5F5A] hover:text-[#1C1412]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Flash message */}
      {msg && (
        <div className={`mx-4 mt-4 px-4 py-3 rounded-lg text-[13px] font-medium ${
          msg.type === "ok"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {msg.text}
        </div>
      )}

      {/* ── ADD TAB ─────────────────────────────────────── */}
      {tab === "add" && (
        <div className="p-4 space-y-5 pb-10">

          {/* Photo uploads */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#7A5F5A] mb-2">
              Photos (both mannequins in each shot)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Front photo", which: "front", prev: frontPrev, ref: frontRef },
                { label: "Back photo",  which: "back",  prev: backPrev,  ref: backRef  },
              ].map(({ label, which, prev, ref }) => (
                <div key={which}>
                  <input
                    ref={ref}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => pickFile(which, e.target.files[0])}
                  />
                  <button
                    onClick={() => ref.current?.click()}
                    className="w-full aspect-[3/4] rounded-xl border-[1.5px] border-dashed border-[#E0C0B8] bg-[#F5E8E4] flex flex-col items-center justify-center overflow-hidden relative hover:border-[#C4877D] transition-colors active:scale-[0.98]"
                  >
                    {prev ? (
                      <Image src={prev} alt="" fill className="object-cover" unoptimized />
                    ) : (
                      <>
                        <span className="text-2xl mb-1">📷</span>
                        <span className="text-[11px] font-medium text-[#7A5F5A]">{label}</span>
                        <span className="text-[10px] text-[#B09690]">Tap to choose</span>
                      </>
                    )}
                  </button>
                  {prev && (
                    <button
                      onClick={() => {
                        if (which === "front") { setFrontFile(null); setFrontPrev(null); }
                        else                   { setBackFile(null);  setBackPrev(null);  }
                      }}
                      className="w-full mt-1 text-[11px] text-[#C4877D] text-center"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-[11px] font-medium uppercase tracking-widest text-[#7A5F5A] mb-2 block">
              Category
            </label>
            <select
              value={form.cat}
              onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))}
              className="w-full border border-[#E0C0B8] rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-[#C4877D] bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Left + Right outfit details */}
          {[
            { side: "L", label: "Left outfit",  priceKey: "leftPrice",  sizesKey: "leftSizes",  color: "#C4877D" },
            { side: "R", label: "Right outfit", priceKey: "rightPrice", sizesKey: "rightSizes", color: "#7BA3C9" },
          ].map(({ side, label, priceKey, sizesKey, color }) => (
            <div key={side} className="bg-[#F5E8E4] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <p className="text-[13px] font-medium text-[#1C1412]">{label}</p>
              </div>
              <label className="text-[11px] text-[#7A5F5A] uppercase tracking-wider mb-1 block">
                Price (KES)
              </label>
              <input
                type="number"
                placeholder="e.g. 850"
                value={form[priceKey]}
                onChange={(e) => setForm((f) => ({ ...f, [priceKey]: e.target.value }))}
                className="w-full border border-[#E0C0B8] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#C4877D] bg-white mb-3"
              />
              <label className="text-[11px] text-[#7A5F5A] uppercase tracking-wider mb-2 block">
                Available sizes
              </label>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((s) => {
                  const on = form[sizesKey].includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSize(side, s)}
                      className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all duration-200 ${
                        on
                          ? "bg-[#1C1412] text-white border-[#1C1412]"
                          : "border-[#E0C0B8] bg-white text-[#7A5F5A] hover:border-[#C4877D]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-[#1C1412] text-white rounded-xl text-[14px] font-medium disabled:opacity-50 hover:opacity-85 active:scale-[0.98] transition-all duration-200"
          >
            {loading ? "Uploading & saving…" : "Add to store"}
          </button>
        </div>
      )}

      {/* ── MANAGE TAB ──────────────────────────────────── */}
      {tab === "manage" && (
        <div className="p-4 pb-10">
          {products.length === 0 ? (
            <div className="text-center py-16 text-[#7A5F5A] text-[13px]">
              No listings yet. Add your first one!
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border border-[#E0C0B8] rounded-xl bg-white overflow-hidden"
                >
                  {/* Product row */}
                  <div className="flex gap-3 items-center p-3">
                    <div className="relative w-14 h-[74px] rounded-lg overflow-hidden flex-shrink-0 bg-[#F5E8E4]">
                      <Image src={p.front_url} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#7A5F5A]">{p.cat}</p>
                      <p className="text-[13px] font-medium text-[#1C1412] mt-0.5">
                        L: KES {p.left_price.toLocaleString()} · R: KES {p.right_price.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#7A5F5A] mt-0.5 truncate">
                        L: {p.left_sizes.join(", ")} | R: {p.right_sizes.join(", ")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-[11px] px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Sold-out toggles */}
                  <div className="border-t border-[#F5E8E4] px-3 py-2 flex items-center gap-2 flex-wrap">
                    <p className="text-[10px] text-[#7A5F5A]">Mark sold out:</p>
                    {[
                      { key: "left_sold_out",  label: "Left",  val: p.left_sold_out  },
                      { key: "right_sold_out", label: "Right", val: p.right_sold_out },
                    ].map(({ key, label, val }) => (
                      <button
                        key={key}
                        onClick={() => handleToggleSoldOut(p.id, key, !val)}
                        className={`text-[11px] px-3 py-1 rounded-full border font-medium transition-all duration-200 ${
                          val
                            ? "bg-[#1C1412] text-white border-[#1C1412]"
                            : "border-[#E0C0B8] text-[#7A5F5A] hover:border-[#C4877D]"
                        }`}
                      >
                        {label} {val ? "✓ Sold" : "Available"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}