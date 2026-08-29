/**
 * API client for HorizonPay backend.
 *
 * In development, all calls go through Vite's built-in dev proxy at /api,
 * which forwards them to the local backend (VITE_API_BASE_URL in .env).
 * This avoids CORS entirely without needing a separate server.
 *
 * The JWT token (stored in localStorage via auth.ts) is automatically
 * attached to every request as `Authorization: Bearer <token>`.
 */

import { getToken } from "@/lib/auth";


// export const API_BASE = "/api";
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

/** Standard JSON headers. */
const BASE_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

/**
 * Fetch wrapper that auto-attaches the stored JWT and routes through
 * the Vite dev proxy to the local backend.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = getToken();
  const authHeaders: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...BASE_HEADERS,
      ...authHeaders,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let msg = `API ${path} returned ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string; message?: string };
      msg = body.error ?? body.message ?? msg;
    } catch {
      // ignore parse errors
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

/** Parse a hex-encoded big-endian integer (e.g. "00", "01a2") into a number. */
export function parseHexAmount(hex: string): number {
  if (!hex || hex === "00" || hex === "") return 0;
  return parseInt(hex, 16);
}

/**
 * Convert a raw on-chain amount (smallest unit) to a display value.
 * USDC on Solana uses 6 decimal places.
 */
export function toUsdc(raw: number, decimals = 6): number {
  return raw / Math.pow(10, decimals);
}

/** Format a USDC amount as a USD display string. */
export function formatUsdc(raw: number | string, decimals = 6): string {
  const n = typeof raw === "string" ? parseHexAmount(raw) : raw;
  const value = toUsdc(n, decimals);
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Shorten a wallet address: first 4 + "..." + last 4. */
export function shortWallet(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}
