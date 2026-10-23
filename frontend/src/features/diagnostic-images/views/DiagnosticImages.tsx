import React from 'react';
import { useDiagnosticImages } from '../hooks/useDiagnosticImages';
import type { IDiagnosticImages } from '../types/diagnostic-images.types';
import { DiagnosticImagesList } from '../components/diagnostic_images_list/DiagnosticImagesList';

export const ImagesView: React.FC = () => {
  const { images, loading } = useDiagnosticImages();

  if (loading) return <p>Cargando imágenes...</p>;

  const handleSelectImage = (img: IDiagnosticImages) => {
    console.log('Seleccionaste la imagen:', img.id);
    // Aquí puedes abrir un modal, navegar a detalle, etc.
  };

  return (
    <DiagnosticImagesList images={images} onSelectImage={handleSelectImage} />
  );
};