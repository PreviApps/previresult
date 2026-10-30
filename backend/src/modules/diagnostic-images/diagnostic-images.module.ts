import { Module } from '@nestjs/common';
import { DiagnosticImagesService } from './diagnostic-images.service';
import { DiagnosticImagesController } from './diagnostic-images.controller';
import { EDXService } from 'src/services/edx/edx.service';

@Module({
  controllers: [DiagnosticImagesController],
  providers: [DiagnosticImagesService, EDXService],
})
export class DiagnosticImagesModule {}
