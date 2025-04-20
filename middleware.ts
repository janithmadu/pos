import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Secret key for JWT (the same as used in token generation)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

export async function middleware(req: Request) {
  const encoder = new TextEncoder();
  const encodedSecretKey = encoder.encode(JWT_SECRET);
  const token = req.headers.get("Authorization")?.split(" ")[1]; 

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 401 });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwtVerify(token, encodedSecretKey); // Use env variable for JWT_SECRET
    // Optionally log the decoded information

    const dec = (await decoded).payload


  } catch (error) {
    console.error("Token verification failed:", error);
    // If token is expired or invalid, send a response
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }

  // Token is valid, proceed to the next handler
  return NextResponse.next();
}

// Apply middleware only to specific routes (example: '/api/protected/*')
export const config = {
  matcher: "/api/protect/:path*",
  runtime: "experimental-edge",
};
