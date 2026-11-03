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
      credentials: 'include', // <--- ¡Vital para enviar y recibir la cookie!
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.docNumber) {
      return {
        username: data.username,
        typeDoc: data.typeDoc,
        docNumber: data.docNumber,
      };
    }
    return null;
  } catch (error) {
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