import { useState, useEffect } from "react";

interface BootstrapData {
  user: any;
  permissions: string[];
  settings: any;
  notifications: any[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch all initial CRM data in a single call (BFF Pattern)
 */
export function useBootstrap() {
  const [data, setData] = useState<BootstrapData>({
    user: null,
    permissions: [],
    settings: null,
    notifications: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchBootstrap() {
      try {
        const token = localStorage.getItem("token"); // Simulated token
        const response = await fetch("/api/bootstrap", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to bootstrap CRM data");
        
        const bootstrapData = await response.json();
        setData({
          ...bootstrapData,
          isLoading: false,
          error: null,
        });
      } catch (err: any) {
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message,
        }));
      }
    }

    fetchBootstrap();
  }, []);

  return data;
}
