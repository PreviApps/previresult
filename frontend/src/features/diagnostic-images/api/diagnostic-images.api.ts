const API_URL = import.meta.env.VITE_API_URL

export interface DiagnosticImagesPayload {
  tipo_documento: string
  numero_documento: string
}

export interface DICOMImagePayload {
  report_id: string
  studyInstanceUIDs: string
}

export const getImages = async (payload: DiagnosticImagesPayload): Promise<any> => {
  const response = await fetch(`${API_URL}/diagnostic-images/orders`, {
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

export const getSummaryPerReport = async (param: string | number): Promise<any> => {
  const response = await fetch(`${API_URL}/diagnostic-images/order-detail/${param}`);
  if (!response.ok) throw new Error('Error al consultar el detalle del reporte');

  const data = await response.json();
  return data;
}

export const getDocument = async (param: string | number): Promise<any> => {
  const response = await fetch(`${API_URL}/diagnostic-images/get-document/${param}`);
  if (!response.ok) throw new Error('Error al consultar el documento del reporte');

  const data = await response.json();
  return data;
}

export const getDICOMContent = async (payload: DICOMImagePayload): Promise<any> => {
  const response = await fetch(`${API_URL}/diagnostic-images/get-rx`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Error al obtener el visor DICOM');
  }
  return await response.json();
};