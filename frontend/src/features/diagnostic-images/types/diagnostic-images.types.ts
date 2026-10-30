export interface IDiagnosticImages{
  id: number
  code: string
  clinical_info: string
  report_id: number
  patient_id: number
  pacs_uid: string
  created_at: string
  state: string
  pacsng_uid: string
  patient_details: Patient
}

export interface Patient{
  id: number
  first_name: string
  last_name: string
  document_number: string
  birth_date: string
  gender: string
}

export type CreateDiagnosticImage = Omit<IDiagnosticImages, 'id'>