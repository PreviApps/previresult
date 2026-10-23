import { IsNotEmpty, IsString } from "class-validator"

export class FindResultsLaboratory{
  /**Tipo de documento del paciente: CC, TI... */
  @IsString()
  @IsNotEmpty()
  tipo_documento!: string

  /**Número de documento */
  @IsString()
  @IsNotEmpty()
  id_paci!: string

  /**Fecha de inicio en formato dd/mm/aaaa*/
  @IsString()
  @IsNotEmpty()
  fecha_ini!: string

  /**Fecha de inicio en formato dd/mm/aaaa*/
  @IsString()
  @IsNotEmpty()
  fecha_fin!: string
}