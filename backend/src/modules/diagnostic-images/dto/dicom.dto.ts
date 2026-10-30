import { IsNotEmpty, IsString } from "class-validator"

export class DICOMDto {
  @IsString()
  @IsNotEmpty()
  report_id!: string

  /**pacs_uid del reporte */
  @IsString()
  @IsNotEmpty()
  studyInstanceUIDs!: string
}