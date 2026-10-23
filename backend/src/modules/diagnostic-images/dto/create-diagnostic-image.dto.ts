import { IsNotEmpty, IsString } from "class-validator";

export class CreateDiagnosticImageDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  folio!: string;

  @IsString()
  @IsNotEmpty()
  diagnosticvo!: string;

}
