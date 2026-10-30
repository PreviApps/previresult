import { useState } from "react";
import { getDICOMContent, type DICOMImagePayload } from "../api/diagnostic-images.api";

export const useDiagnosticImageDICOM = () => {
  const [loadingDicom, setLoadingDicom] = useState<boolean>(false);

  const handleOpenDicom = async (reportId: string, pacsUid: string) => {
    try {
      setLoadingDicom(true);

      const payload: DICOMImagePayload = {
        report_id: reportId,
        studyInstanceUIDs: pacsUid
      }

      const data = await getDICOMContent(payload);
      if (data?.url) {
        window.open(data.url, '_blank'); // Abre el visor oficial directamente
      }
    } catch (err) {
      console.error("Error al cargar DICOM:", err);
    } finally {
      setLoadingDicom(false);
    }
  };

  return { handleOpenDicom, loadingDicom };
}