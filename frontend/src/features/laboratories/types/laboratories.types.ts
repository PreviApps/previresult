export interface ILaboratories{
  id: string;
  fechaSolicitud: string
  cod_entidad: string
  nom_entidad: string
  paciente: Patient
  examenes: Exam[]
}

interface Patient{
  tipo_documento: string
  num_documento: string
  nombre_paciente: string
}

interface Exam{
  nombreExamen: string
  fechaResultado: string
  horaResultado: string
  tecnica: string
  idProfesional: string
  nombreProfesional: string
  id_examen: string
  cod_cups: string
  resultado: Result[]
}

interface Result{
  codigoAnalito: string
  nombreAnalito: string
  resultado: string
  unidadMedida: string
  valorReferencia: string
}

export type CreateLaboratorie = Omit<ILaboratories, 'id'>