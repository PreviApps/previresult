import { useState } from "react";
import { getDocument } from "../api/diagnostic-images.api";

export const useDiagnosticPDF = () => {
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);

  const handleOpenPdf = async (reportId: string | number) => {
    try {
      setLoadingPdf(true);
      const response = await getDocument(reportId);
      
      // Validamos que venga la respuesta y el campo data con el base64
      if (response?.status === "SUCCESS" && response?.data) {
        const base64Data = response.data;

        // Convertimos el Base64 a un Blob de tipo PDF
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Creamos una URL temporal para el blob
        const blobUrl = URL.createObjectURL(blob);

        // Abrimos el PDF en una nueva pestaña
        window.open(blobUrl, '_blank');

        // Opcional: limpiar la URL del blob después de un tiempo para liberar memoria
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else {
        alert("El reporte no está disponible en formato PDF.");
      }

    } catch (err) {
      console.error("Error al obtener el documento PDF:", err);
      alert("Ocurrió un error al intentar generar el PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  return { handleOpenPdf, loadingPdf };
};