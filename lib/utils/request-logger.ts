import { NextRequest } from "next/server";

/**
 * Logs basic information about an incoming Next.js API request.
 * NOTE: Reading the body here would consume the stream so we avoid it.
 */
export function logRequest(request: NextRequest): void {
  try {
    const { method } = request;
    const url = request.url;
    const headers = Object.fromEntries(request.headers.entries());

    console.log(`[API] ${method} ${url}`);
    console.log(`[API] Headers:`, headers);
  } catch (err) {
    console.error("[API] Failed to log request:", err);
  }
}
