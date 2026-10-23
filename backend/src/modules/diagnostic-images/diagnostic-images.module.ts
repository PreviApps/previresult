import { Module } from '@nestjs/common';
import { DiagnosticImagesService } from './diagnostic-images.service';
import { DiagnosticImagesController } from './diagnostic-images.controller';

@Module({
  controllers: [DiagnosticImagesController],
  providers: [DiagnosticImagesService],
})
export class DiagnosticImagesModule {}
