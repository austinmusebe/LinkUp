import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function authMiddleware(authorization: string | undefined) {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return { success: false, error: "Unauthorized" };
  }

  const token = authorization.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return { success: false, error: "Invalid token" };
  }

  return { success: true, userId: payload.userId, email: payload.email };
}
