import type { ILaboratories } from "../../types/laboratories.types";

export interface LaboratoriesDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  laboratorie: ILaboratories | null;
}