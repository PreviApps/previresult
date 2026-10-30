import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiagnosticImagesService } from './diagnostic-images.service';
import { PatientDto } from './dto/patient.dto';
import { DICOMDto } from './dto/dicom.dto';

@Controller('diagnostic-images')
export class DiagnosticImagesController {
  constructor(private readonly diagnosticImagesService: DiagnosticImagesService) {}

  @Post('orders')
  findOrdersPerPatient(@Body() patientDto: PatientDto) {
    return this.diagnosticImagesService.findOrdersPerPatient(patientDto.tipo_documento, patientDto.numero_documento);
  }

  @Get('order-detail/:report_id')
  getSummaryPerReport(@Param('report_id') report_id: string | number){
    return this.diagnosticImagesService.getSummaryPerReport(report_id);
  }

  @Get('get-document/:report_id')
  getDocument(@Param('report_id') report_id: string | number){
    return this.diagnosticImagesService.getDocument(report_id);
  }

  @Post('get-rx')
  getDiagnosticImageDICOM(@Body() dicomDTO: DICOMDto){
    return this.diagnosticImagesService.getDiagnosticImageDICOM(dicomDTO.report_id, dicomDTO.studyInstanceUIDs);
  }

}
