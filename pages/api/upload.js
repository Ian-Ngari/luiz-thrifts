import cloudinary from "../../lib/cloudinary";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const adminPwd = req.headers["x-admin-password"];
  if (adminPwd !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: "Unauthorized" });

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "luiz-mitumba-thrifts";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  return res.status(200).json({
    signature,
    timestamp,
    folder,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
  });
}