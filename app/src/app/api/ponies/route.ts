import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const getSHA256Hash = async (input: string) => {
  const textAsBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
};

export async function GET(req: NextRequest, res: NextApiResponse) {
  const ip = await getSHA256Hash(
    req.headers.get("x-forwarded-for") || "unknown"
  );

  console.log(`Request received from IP: ${ip}`);

  return NextResponse.json({
    message: "Hello from the ponies API!",
  });
}
