import { CustomCard } from "../../../../components/custom_card/CustomCard";
import { adaptToCard } from "../../../../utils/card.adapter";
import type { ILaboratories } from "../../types/laboratories.types";

interface LaboratoriesListProps {
  laboratories: ILaboratories[];
  onSelectLaboratorie?: (lab: ILaboratories) => void;
}

export const LaboratoriesList: React.FC<LaboratoriesListProps> = ({
  laboratories,
  onSelectLaboratorie
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {laboratories.map((lab) => {
        // Usamos el adaptador solo para las props básicas
        const cardProps = adaptToCard({
          item: lab,
          getTitle: (i) => `Orden No: ${i.id}`,
          getDescription: (i) => `Fecha de solicitud: ${i.fechaSolicitud}`,
          onClick: (i) => onSelectLaboratorie?.(i)
        });

        return (
          <CustomCard key={lab.id} {...cardProps} onClick={() => onSelectLaboratorie?.(lab)}>
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                  Folio: {lab.cod_entidad}
                </span>

                <span className="text-slate-400 text-[10px]">Fecha: {lab.fechaSolicitud}</span>
              </div>
            </div>
          </CustomCard>
        );
      })}
    </div>
  );
};