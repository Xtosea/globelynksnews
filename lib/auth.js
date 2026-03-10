import jwt from "jsonwebtoken";

export function verifyAdmin(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return null;
    return decoded;
  } catch (err) {
    return null;
  }
}