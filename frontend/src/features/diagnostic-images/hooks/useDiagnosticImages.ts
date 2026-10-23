import { useEffect, useState } from "react";
import type { IDiagnosticImages } from "../types/diagnostic-images.types";
import { getImages } from "../api/diagnostic-images.api";

export const useDiagnosticImages = () => {
  const [images, setImages] = useState<IDiagnosticImages[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDta = async () => {
      try {
        setLoading(true);
        const data = await getImages();
        setImages(data);
      } catch (err) {
        setError('Error al cargar las imágenes médicas');
      } finally {
        setLoading(false);
      }
    };

    fetchDta();
  }, []);

  return { images, loading, error };
}