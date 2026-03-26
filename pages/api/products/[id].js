import { supabase } from "../../../lib/supabase";
import cloudinary from "../../../lib/cloudinary";

export default async function handler(req, res) {
  const { id } = req.query;
  const adminPwd = req.headers["x-admin-password"];

  // ── PUT /api/products/[id] — edit price, sizes, category ──
  if (req.method === "PUT") {
    if (adminPwd !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: "Unauthorized" });

    const { cat, left_price, left_sizes, right_price, right_sizes } = req.body;

    const update = {};
    if (cat         !== undefined) update.cat         = cat;
    if (left_price  !== undefined) update.left_price  = parseInt(left_price);
    if (left_sizes  !== undefined) update.left_sizes  = left_sizes;
    if (right_price !== undefined) update.right_price = parseInt(right_price);
    if (right_sizes !== undefined) update.right_sizes = right_sizes;

    const { data, error } = await supabase
      .from("products")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ── PATCH /api/products/[id] — toggle sold out ─────────────
  if (req.method === "PATCH") {
    if (adminPwd !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: "Unauthorized" });

    const { left_sold_out, right_sold_out } = req.body;
    const update = {};
    if (left_sold_out  !== undefined) update.left_sold_out  = left_sold_out;
    if (right_sold_out !== undefined) update.right_sold_out = right_sold_out;

    const { data, error } = await supabase
      .from("products")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ── DELETE /api/products/[id] ───────────────────────────────
  if (req.method === "DELETE") {
    if (adminPwd !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: "Unauthorized" });

    const { data: product } = await supabase
      .from("products").select("*").eq("id", id).single();

    if (product) {
      const ids = [product.front_public_id, product.back_public_id].filter(Boolean);
      if (ids.length) await cloudinary.api.delete_resources(ids).catch(() => {});
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}