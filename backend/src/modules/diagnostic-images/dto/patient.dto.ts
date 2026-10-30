import { IsNotEmpty, IsString } from "class-validator"

export class PatientDto{
    @IsString()
    @IsNotEmpty()
    tipo_documento!: string
  
    /**Número de documento */
    @IsString()
    @IsNotEmpty()
    numero_documento!: string
}