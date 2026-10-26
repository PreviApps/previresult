import type { SpecialistSignature } from "../types/signatures.types";

const API_URL = import.meta.env.VITE_API_URL;

export const getSpecialistSignature = async (usrCodigo: string): Promise<SpecialistSignature> => {
  const response = await fetch(`${API_URL}/signatures/${usrCodigo}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) throw new Error('Error al obtener la firma');
  return await response.json();
};