import { NextResponse } from "next/server";

/**
 * BFF (Backend-for-Frontend) Aggregation Route
 * Aggregates multiple Django API calls into a single response.
 */
export async function GET(request: Request) {
  // Simulated Backend URL (Update this in Render/Vercel ENV)
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://pest-control-erp.onrender.com";
  
  // Forward authorization if present
  const authHeader = request.headers.get("authorization") || "";

  try {
    // Parallel Fetching using Promise.all
    // Fallback Mock data since user/settings/etc endpoints might not exist yet
    const fetchWithFallback = async (endpoint: string, fallback: any) => {
      try {
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
          headers: { 
            "Authorization": authHeader,
            "Content-Type": "application/json"
          },
          next: { revalidate: 300 } // Individual cache for 5 min
        });
        if (!res.ok) return fallback;
        return await res.json();
      } catch (err) {
        return fallback;
      }
    };

    const [user, permissions, settings, notifications] = await Promise.all([
      fetchWithFallback("/api/user/", { email: "dev@aflick.com", name: "Subash" }),
      fetchWithFallback("/api/permissions/", ["admin"]),
      fetchWithFallback("/api/settings/", { theme: "dark", lang: "en" }),
      fetchWithFallback("/api/notifications/", [])
    ]);

    return NextResponse.json({
      user,
      permissions,
      settings,
      notifications,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: "Bootstrap failed" }, { status: 500 });
  }
}
