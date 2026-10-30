import type { IDiagnosticImages } from "../types/diagnostic-images.types";

export interface DiagnosticImagesDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  reportImage: IDiagnosticImages | null;
}