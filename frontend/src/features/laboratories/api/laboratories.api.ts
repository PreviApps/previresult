import type { ILaboratories } from "../types/laboratories.types";

const API_URL = import.meta.env.VITE_API_URL

export interface LaboratoriesPayload{
  tipo_documento: string
  id_paci: string
  fecha_ini: string
  fecha_fin: string
}

export const getLaboratories = async (payload: LaboratoriesPayload): Promise<ILaboratories[]> => {
  // Simulamos latencia de red opcionalmente o retornamos directo
  const response = await fetch(`${API_URL}/laboratories/find`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Error al consultar laboratorios');
  const data = await response.json();
  return data
};