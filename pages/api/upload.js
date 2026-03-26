import { uploadToCloudinary } from "../../lib/cloudinary";
import multer from "multer";

// Use memory storage — file goes straight to Cloudinary, never touches disk
const upload = multer({ storage: multer.memoryStorage() });

// Disable Next.js default body parser so multer can handle multipart
export const config = { api: { bodyParser: false } };

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Admin check
  const adminPwd = req.headers["x-admin-password"];
  if (adminPwd !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Parse the multipart upload — fields: "front" and "back"
    await runMiddleware(req, res, upload.fields([
      { name: "front", maxCount: 1 },
      { name: "back",  maxCount: 1 },
    ]));

    const results = {};

    if (req.files?.front?.[0]) {
      results.front = await uploadToCloudinary(req.files.front[0].buffer);
    }
    if (req.files?.back?.[0]) {
      results.back = await uploadToCloudinary(req.files.back[0].buffer);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
}
