import { useEffect, useState } from "react";
import { getSummaryPerReport } from "../api/diagnostic-images.api";

export const useDiagnosticImageDetails = (reportId: string | number | null, isOpen: boolean) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      // Solo consultamos si el sheet está abierto y el reportId es válido
      if (!isOpen || reportId === null || reportId === undefined) {
        setDetails(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getSummaryPerReport(reportId);
        setDetails(data);
      } catch (err) {
        setError('Error al cargar los detalles del reporte');
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, reportId]);

  return { details, loading, error };
}