import { useEffect, useState } from "react";
import type { IDiagnosticImages, Patient } from "../types/diagnostic-images.types";
import { getImages, type DiagnosticImagesPayload } from "../api/diagnostic-images.api";
import { getSessionData } from "../../../core/auth/auth";

export const useReportDiagnosticImages = () => {
  const [reportImages, setReportImages] = useState<IDiagnosticImages[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDta = async () => {
      try {
        setLoading(true);
        setError(null);

        const sessionData = getSessionData();

        if (!sessionData) {
          throw new Error("No hay sesión activa");
        }

        const payload: DiagnosticImagesPayload = {
          tipo_documento: sessionData.typeDoc,
          //numero_documento: idPaci || "33212990",
          numero_documento: sessionData.docNumber,
        };

        const data = await getImages(payload);

        const rawPatient = data?.patient;
        const rawOrders = data?.filteredOrders || [];
        
        const mappedImages: IDiagnosticImages[] = rawOrders.map((order: any) => ({
          ...order,
          patient_details: {
            id: rawPatient?.id,
            first_name: rawPatient?.first_name,
            last_name: rawPatient?.last_name,
            document_number: rawPatient?.patident,
            birth_date: rawPatient?.birth_date,
            gender: rawPatient?.sex,
          }
        }));

        setPatient(rawPatient);
        setReportImages(mappedImages);
      } catch (err: any) {
        setError(err.message || 'Error al cargar las órdenes médicas');
        setReportImages([]);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDta();
  }, []);

  return { reportImages, patient, loading, error };
}