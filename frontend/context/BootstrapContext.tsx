"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BootstrapState {
  user: any;
  permissions: string[];
  settings: any;
  notifications: any[];
}

interface BootstrapContextType {
  data: BootstrapState | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const BootstrapContext = createContext<BootstrapContextType | undefined>(undefined);

export function BootstrapProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BootstrapState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBootstrap = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/bootstrap");
      if (!res.ok) throw new Error("Bootstrap failed");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBootstrap();
  }, []);

  return (
    <BootstrapContext.Provider value={{ data, isLoading, error, refresh: fetchBootstrap }}>
      {children}
    </BootstrapContext.Provider>
  );
}

export function useBootstrap() {
  const context = useContext(BootstrapContext);
  if (context === undefined) {
    throw new Error("useBootstrap must be used within a BootstrapProvider");
  }
  return context;
}
