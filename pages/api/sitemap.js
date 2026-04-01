import { supabase } from "../lib/supabase";

const BASE_URL = "https://luizmitumbathrifts.co.ke";

// Helper to escape XML special characters
function escapeXml(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, (char) => {
    const chars = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&apos;", '"': "&quot;" };
    return chars[char];
  });
}

function generateSiteMap(products) {
  const counties = [
    "nairobi", "kisumu", "nakuru", "mombasa", "eldoret", "kericho", "kisii",
    "machakos", "kajiado", "kiambu", "murang_a", "nyeri", "kirinyaga", "embu",
    "tharaka-nithi", "isiolo", "meru", "samburu", "laikipia", "baringo",
    "elgeyo-marakwet", "nandi", "bomet", "kakamega", "vihiga", "bungoma",
    "busia", "siaya", "homa-bay", "migori", "nyamira", "turkana", "west-pokot",
    "kilifi", "kwale", "lamu", "taita-taveta", "garissa", "wajir", "mandera",
    "marsabit", "tana-river", "narok", "trans-nzoia", "uasin-gishu", "mogotio"
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Homepage -->
     <url>
       <loc>${BASE_URL}</loc>
       <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <!-- Cart Page -->
     <url>
       <loc>${BASE_URL}/cart</loc>
       <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <!-- Product Pages -->
     ${products
       .map((product) => {
         return `
     <url>
       <loc>${BASE_URL}/product/${escapeXml(product.id)}</loc>
       <lastmod>${product.created_at ? product.created_at.split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>`;
       })
       .join("")}
     <!-- County Delivery Pages -->
     ${counties
       .map((county) => {
         return `
     <url>
       <loc>${BASE_URL}/delivery/${escapeXml(county)}</loc>
       <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>`;
       })
       .join("")}
   </urlset>
 `;
}

export default async function handler(req, res) {
  try {
    // Fetch all products
    const { data: products, error } = await supabase
      .from("products")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const sitemap = generateSiteMap(products || []);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Sitemap error:", error);
    res.status(500).end("Error generating sitemap");
  }
}
