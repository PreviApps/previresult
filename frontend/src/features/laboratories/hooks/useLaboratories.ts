import { useState } from "react";
import type { ILaboratories } from "../types/laboratories.types";
import { getLaboratories, type LaboratoriesPayload } from "../api/laboratories.api";
import type { DateValue } from "@heroui/react";
import { getSessionData } from "../../../core/auth/auth";

type DateRangeType = {
  start: DateValue;
  end: DateValue;
} | null;

export const useLaboratories = () => {
  const [laboratories, setLaboratories] = useState<ILaboratories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const fetchLaboratories = async (dateRange: DateRangeType) => {
    if (!dateRange || !dateRange.start || !dateRange.end) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const formatNumber = (n: number) => String(n).padStart(2, "0");
      const fecha_ini = `${formatNumber(dateRange.start.day)}/${formatNumber(dateRange.start.month)}/${dateRange.start.year}`;
      const fecha_fin = `${formatNumber(dateRange.end.day)}/${formatNumber(dateRange.end.month)}/${dateRange.end.year}`;

      const sessionData = getSessionData();

      if (!sessionData) {
        throw new Error("No hay sesión activa");
      }

      const payload: LaboratoriesPayload = {
        tipo_documento: sessionData.typeDoc,
        //id_paci: idPaci || "33212990",
        id_paci: sessionData.docNumber,
        fecha_ini,
        fecha_fin,
      };

      const data = await getLaboratories(payload);
      setLaboratories(data);
    } catch (err) {
      setError('Error al cargar los laboratorios');
      setLaboratories([]);
    } finally {
      setLoading(false);
    }
  };

  return { laboratories, loading, error, hasSearched, fetchLaboratories };
};