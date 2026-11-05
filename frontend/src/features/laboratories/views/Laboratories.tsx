import { useEffect, useState } from "react";
import { startLabsTour } from "../../tour/tours";
import { LaboratoriesDetailsSheet } from "../components/laboratories_details_sheet/LaboratoriesDetailsSheet";
import { LaboratoriesList } from "../components/laboratories_list/LaboratoriesList";
import type { ILaboratories } from "../types/laboratories.types";

interface LaboratoriesViewProps {
  laboratories: ILaboratories[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export const LaboratoriesView: React.FC<LaboratoriesViewProps> = ({
  laboratories,
  loading,
  error,
  hasSearched
}) => {

  const [selectedLaboratorie, setSelectedLaboratorie] = useState<ILaboratories | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelectLaboratorie = (lab: ILaboratories) => {
    setSelectedLaboratorie(lab)
    setIsSheetOpen(true)
  };

  // Tour de laboratorios: la primera vez que la consulta lista tarjetas
  useEffect(() => {
    if (!loading && laboratories.length > 0) {
      const t = setTimeout(startLabsTour, 300);
      return () => clearTimeout(t);
    }
  }, [loading, laboratories]);

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 gap-2">
        <p className="text-base font-medium">Selecciona un rango de fechas y presiona <strong>Consultar</strong> para consultar los laboratorios.</p>
      </div>
    );
  }
  if (loading) return <p>Cargando laboratorios...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (laboratories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 gap-2">
        <p className="text-base font-medium">No se encontraron resultados de laboratorios para el rango de fechas seleccionado.</p>
      </div>
    );
  }

  return (
    <>
      <LaboratoriesList
        laboratories={laboratories}
        onSelectLaboratorie={handleSelectLaboratorie}
      />

      <LaboratoriesDetailsSheet
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedLaboratorie(null);
        }}
        laboratorie={selectedLaboratorie}
      />
    </>
  );
};