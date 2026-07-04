"use client";

import { ReactNode } from "react";
import { useConsult } from "./ConsultContext";

export function ConsultTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open } = useConsult();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
