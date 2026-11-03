import { CustomCard } from "../../../../components/custom_card/CustomCard";
import { adaptToCard } from "../../../../utils/card.adapter";
import { formatDate } from "../../../../utils/date.helper";
import type { IDiagnosticImages, Patient } from "../../types/diagnostic-images.types"

interface DiagnosticImagesListProps {
  images: IDiagnosticImages[];
  patient: Patient
  onSelectImage?: (image: IDiagnosticImages) => void;
}

export const DiagnosticImagesList: React.FC<DiagnosticImagesListProps> = ({
  images,
  onSelectImage
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {images.map((img) => {
        // Usamos el adaptador solo para las props básicas
        const cardProps = adaptToCard({
          item: img,
          getTitle: (i) => `Orden No: ${i.code}`,
          getDescription: (i) => `Fecha: ${formatDate(i.created_at)}`,
          onClick: (i) => onSelectImage?.(i)
        });

        return (
          <CustomCard key={img.id} {...cardProps} onClick={()=> onSelectImage?.(img)}>
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                  Orden de especialista
                </span>
                <span className="text-slate-400 text-[10px]">{/*ID: {img.id}*/}</span>
              </div>
            </div>
          </CustomCard>
        );
      })}
    </div>
  );
};