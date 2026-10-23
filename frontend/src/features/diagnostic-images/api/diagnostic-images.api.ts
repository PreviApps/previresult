import type { IDiagnosticImages } from "../types/diagnostic-images.types";

const imagenesMock: IDiagnosticImages[] = [
  { id: 'ujcsdbfgkuieabfuoabefuaj', name: 'Radiografía de tórax', folio: 'HCN001234', diagnostico: 'No presenta facturas' },
  { id: 'uhtouabnfoaeuifbnoa4ef', name: 'Cráneo rx', folio: 'HCN0012234', diagnostico: 'Todo ok' },
  { id: 'kadnfglabnfaleifbna', name: 'Cráneo rx', folio: 'HCN0012234', diagnostico: 'Todo ok' },
  { id: 'shjkfgbkabnfia3nfalinrf3n', name: 'Cráneo rx', folio: 'HCN0012234', diagnostico: 'Todo ok' },
  { id: 'aejfni3apdfaprkaprfj3arp', name: 'Cráneo rx', folio: 'HCN0012234', diagnostico: 'Todo ok' },
];

export const getImages = async (): Promise<IDiagnosticImages[]> => {
  // Simulamos latencia de red opcionalmente o retornamos directo
  return imagenesMock;
};

/*export const createImage = async (payload: CreateDiagnosticImage): Promise<IDiagnosticImages> => {
  const nueva: IDiagnosticImages = {
    id: Date.now(), // Simulado
    ...payload,
  };
  imagenesMock.push(nueva);
  return nueva;
};*/