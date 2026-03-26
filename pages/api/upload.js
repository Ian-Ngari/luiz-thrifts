import { uploadToCloudinary } from "../../lib/cloudinary";
import multer from "multer";
import sharp from "sharp";

// Increase Next.js body size limit to 50MB
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "50mb",
  },
};

// Accept up to 50MB per file
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

async function compressImage(buffer) {
  // Resize to max 2000px wide (more than enough for a shop),
  // keep aspect ratio, convert to JPEG quality 88.
  // This takes a 15MB phone photo down to ~1–2MB
  // while keeping it visually perfect on any screen.
  return sharp(buffer)
    .resize(2000, 2000, {
      fit: "inside",        // never upscale, just shrink if larger
      withoutEnlargement: true,
    })
    .jpeg({ quality: 88, progressive: true })
    .toBuffer();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const adminPwd = req.headers["x-admin-password"];
  if (adminPwd !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await runMiddleware(req, res, upload.fields([
      { name: "front", maxCount: 1 },
      { name: "back",  maxCount: 1 },
    ]));

    const results = {};

    if (req.files?.front?.[0]) {
      const compressed = await compressImage(req.files.front[0].buffer);
      results.front = await uploadToCloudinary(compressed);
    }

    if (req.files?.back?.[0]) {
      const compressed = await compressImage(req.files.back[0].buffer);
      results.back = await uploadToCloudinary(compressed);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
}