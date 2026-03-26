import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { cat } = req.query;
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (cat && cat !== "all") query = query.eq("cat", cat);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const adminPwd = req.headers["x-admin-password"];
    if (adminPwd !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ error: "Unauthorized" });

    const {
      cat, front_url, back_url, front_public_id, back_public_id,
      left_price, left_sizes, right_price, right_sizes,
      left_sold_out, right_sold_out,
    } = req.body;

    if (!front_url || !back_url || !left_price || !right_price)
      return res.status(400).json({ error: "Missing required fields" });

    const { data, error } = await supabase.from("products").insert([{
      cat,
      front_url, back_url, front_public_id, back_public_id,
      left_price:  parseInt(left_price),
      left_sizes,
      right_price: parseInt(right_price),
      right_sizes,
      left_sold_out:  left_sold_out  || false,
      right_sold_out: right_sold_out || false,
    }]).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).end();
}