import { useEffect, useState } from 'react';
import type { ILaboratories } from '../types/laboratories.types';
import { useSignature } from '../../signatures/hooks/useSignature';

export type SignatureMap = Record<string, { firma: string; profesion: string | null }>;

/**
 * Carga las firmas de los profesionales presentes en la orden de laboratorio.
 * Se usa FUERA del documento PDF: el PDF solo recibe el resultado por props.
 * Las firmas quedan indexadas por idProfesional.
 */
export const useLaboratorySignatures = (laboratorie?: ILaboratories | null) => {
  const { fetchSignature } = useSignature();
  const [signatures, setSignatures] = useState<SignatureMap>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!laboratorie) {
      setSignatures({});
      setLoading(false);
      return;
    }

    let cancelled = false;

    // Profesionales únicos (misma agrupación que el PDF: por nombreProfesional)
    const profesionales = new Map<string, string>(); // nombreProfesional -> idProfesional
    for (const exam of laboratorie.examenes || []) {
      const nombre = exam.nombreProfesional || 'MEDICO GENERAL';
      if (!profesionales.has(nombre)) {
        profesionales.set(nombre, exam.idProfesional);
      }
    }

    const load = async () => {
      setLoading(true);
      const result: SignatureMap = {};

      await Promise.all(
        [...profesionales].map(async ([nombre, id]) => {
          if (!id) return;
          const data = await fetchSignature(nombre); // ¡Sin mandar instancia! El backend busca en las 3.
          if (data) {
            result[id] = {
              firma: data.firma || '',
              profesion: data.profesion || null,
            };
          }
        })
      );

      if (!cancelled) {
        setSignatures(result);
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [laboratorie, fetchSignature]);

  return { signatures, loading };
};
