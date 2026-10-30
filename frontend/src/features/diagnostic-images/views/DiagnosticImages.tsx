import React, { useState } from 'react';
import type { IDiagnosticImages } from '../types/diagnostic-images.types';
import { DiagnosticImagesList } from '../components/diagnostic_images_list/DiagnosticImagesList';
import { useReportDiagnosticImages } from '../hooks/useDiagnosticImages';
import { DiagnosticImagesDetailsSheet } from '../diagnostic_images_details_sheet/DiagnosticImagesDetailsSheet';

export const ImagesView: React.FC = () => {
  const { reportImages, patient, loading, error } = useReportDiagnosticImages();

  const [selectedReportImage, setSelectedReportImage] = useState<IDiagnosticImages | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelectReportImage = (img: IDiagnosticImages) => {
    setSelectedReportImage(img)
    setIsSheetOpen(true)
  };

  if (loading) return <p>Cargando reportes...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (reportImages.length === 0 || !patient) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 gap-2">
        <p className="text-base font-medium">No se encontraron resultados de reportes.</p>
      </div>
    );
  }

  return (
    <>
      <DiagnosticImagesList images={reportImages} patient={patient} onSelectImage={handleSelectReportImage} />

      <DiagnosticImagesDetailsSheet
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedReportImage(null);
        }}
        reportImage={selectedReportImage}
      />

    </>
  );
};