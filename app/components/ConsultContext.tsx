"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

interface ConsultContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ConsultContext = createContext<ConsultContextValue | null>(null);

export function ConsultProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ConsultContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ConsultContext.Provider>
  );
}

export function useConsult(): ConsultContextValue {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error("useConsult must be used inside ConsultProvider");
  return ctx;
}
