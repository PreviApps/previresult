import { Exclude, Expose, Type } from 'class-transformer';

export class ResultDto {
  @Expose() codigoAnalito!: string;
  @Expose() nombreAnalito!: string;
  @Expose() resultado!: string;
  @Expose() unidadMedida!: string;
  @Expose() valorReferencia!: string;
}

export class ExamDto {
  @Expose() nombreExamen!: string;
  @Expose() fechaResultado!: string;
  @Expose() horaResultado!: string;
  @Expose() tecnica!: string;
  @Expose() idProfesional!: string;
  @Expose() nombreProfesional!: string;
  @Expose() id_examen!: string;
  @Expose() cod_cups!: string;

  @Expose()
  @Type(() => ResultDto)
  resultado!: ResultDto[];
}

export class PatientDto {
  @Expose() tipo_documento!: string;
  @Expose() num_documento!: string;
  @Expose() nombre_paciente!: string;
}

export class AnnarResultsLaboratoryDto {
  // 💡 Si en algún momento necesitas que alguna propiedad NO se devuelva nunca, 
  // simplemente le pones @Exclude() arriba (ej: el token si estuviera aquí).
  @Exclude() // 👈 Este se oculta explícitamente
  token?: string;

  @Expose() id!: string;
  @Expose() fechaSolicitud!: string;
  @Expose() cod_entidad!: string;
  @Expose() nom_entidad!: string;

  @Expose()
  @Type(() => PatientDto)
  paciente!: PatientDto;

  @Expose()
  @Type(() => ExamDto)
  examenes!: ExamDto[];
}