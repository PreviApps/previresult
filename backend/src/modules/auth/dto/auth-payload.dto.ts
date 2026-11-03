import { IsNotEmpty, IsString } from "class-validator"

export class AuthPayloadDto{

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  typeDoc!: string

  @IsString()
  @IsNotEmpty()
  docNumber!: string
}