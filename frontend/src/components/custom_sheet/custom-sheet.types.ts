import type { ReactNode } from "react";

export interface CustomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string; // Por defecto max-w-xl (como tu diseño)
}