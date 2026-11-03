/*export const sessionData = {
  username: 'Juan',
  typeDoc: 'CC',
  //docNumber: '33212990',
  //docNumber: '8709951',
  docNumber: '22432796',
}*/

export interface SessionData {
  username: string
  typeDoc: string
  docNumber: string
}

const SESSION_KEY = 'app_external_session';

const API_URL = import.meta.env.VITE_API_URL

export const fetchSessionFromBackend = async (): Promise<SessionData | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/session`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data && data.docNumber && data.typeDoc) {
      const sessionData: SessionData = {
        username: data.username || 'Usuario',
        typeDoc: data.typeDoc,
        docNumber: data.docNumber,
      };

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return sessionData;
    }

    return null;
  } catch (error) {
    console.error("Error al sincronizar la sesión con el backend:", error);
    return null;
  }
};

export const getSessionData = (): SessionData | null => {
  const savedSession = sessionStorage.getItem(SESSION_KEY);
  if (savedSession) {
    try {
      return JSON.parse(savedSession);
    } catch (e) {
      console.error('Error al parsear la sesión ', e);
      return null;
    }
  }
  return null;
}

export const logoutSession = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/auth/session`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error("Error al notificar cierre de sesión al backend", error);
  } finally {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }
};