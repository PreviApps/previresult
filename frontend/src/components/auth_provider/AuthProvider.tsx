import React, { useEffect, useState } from "react";
import { fetchSessionFromBackend, getSessionData } from "../../core/auth/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      let session = getSessionData();

      if (!session) {
        session = await fetchSessionFromBackend();
      }

      if (session && session.docNumber && session.typeDoc) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-medium">Cargando contexto del usuario...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-6 bg-gray-50 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-gray-100">
          <h2 className="text-xl font-bold text-red-600 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 text-sm">
            No se detectó una sesión activa o los datos de identificación son inválidos. Por favor, ingrese desde la aplicación principal.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};