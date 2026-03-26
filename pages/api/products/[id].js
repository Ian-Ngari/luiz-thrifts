import { supabase } from "../../../lib/supabase";
import cloudinary from "../../../lib/cloudinary";

export default async function handler(req, res) {
  const { id } = req.query;
  const adminPwd = req.headers["x-admin-password"];

  if (req.method === "PATCH") {
    if (adminPwd !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: "Unauthorized" });

    const { left_sold_out, right_sold_out } = req.body;
    const update = {};
    if (left_sold_out  !== undefined) update.left_sold_out  = left_sold_out;
    if (right_sold_out !== undefined) update.right_sold_out = right_sold_out;

    const { data, error } = await supabase
      .from("products").update(update).eq("id", id).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

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