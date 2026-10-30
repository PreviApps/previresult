import { Injectable } from '@nestjs/common';
import { DiagnosticImage } from './entities/diagnostic-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EDXService } from 'src/services/edx/edx.service';

@Injectable()
export class DiagnosticImagesService {

  constructor(
    private readonly edxService: EDXService
  ){}

  async findOrdersPerPatient(tipoDoc: string, numDoc: string){
    return await this.edxService.getOrdersPerPatient(tipoDoc, numDoc);
  }

  async getSummaryPerReport(report_id: string | number){
    return await this.edxService.getSummaryPerReport(report_id);
  }

  async getDocument(report_id: string | number){
    return await this.edxService.getDocument(report_id);
  }

  async getDiagnosticImageDICOM(report_id: string | number, studyInstanceUIDs: string){
    return await this.edxService.getDiagnosticImageDICOM(report_id, studyInstanceUIDs);
  }

}
