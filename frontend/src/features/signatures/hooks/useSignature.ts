import { useState, useCallback } from 'react';
import { getSpecialistSignature } from '../api/signatures.api';
import type { SpecialistSignature } from '../types/signatures.types';

export const useSignature = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignature = useCallback(async (usrCodigo: string): Promise<SpecialistSignature | null> => {
    try {
      setLoading(true);
      setError(null);
      return await getSpecialistSignature(usrCodigo);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchSignature,
    loading,
    error,
  };
};