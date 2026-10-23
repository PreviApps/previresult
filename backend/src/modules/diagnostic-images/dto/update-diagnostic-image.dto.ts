import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnosticImageDto } from './create-diagnostic-image.dto';

export class UpdateDiagnosticImageDto extends PartialType(CreateDiagnosticImageDto) {}
