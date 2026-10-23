export interface IDiagnosticImages{
  id: string
  name: string
  folio: string
  diagnostico: string
}

export type CreateDiagnosticImage = Omit<IDiagnosticImages, 'id'>