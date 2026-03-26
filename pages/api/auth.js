export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  const pwd = req.headers["x-admin-password"];
  
  if (!pwd || pwd !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  
  return res.status(200).json({ ok: true });
}