import { Injectable } from '@nestjs/common';
import { CreateDiagnosticImageDto } from './dto/create-diagnostic-image.dto';
import { UpdateDiagnosticImageDto } from './dto/update-diagnostic-image.dto';
import { Repository } from 'typeorm';
import { DiagnosticImage } from './entities/diagnostic-image.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiagnosticImagesService {

  constructor(
    @InjectRepository(DiagnosticImage)
    private readonly diagnosticRepository: Repository<DiagnosticImage>
  ){}

  async create(createDiagnosticImageDto: CreateDiagnosticImageDto): Promise<DiagnosticImage> {
    return await this.diagnosticRepository.create(createDiagnosticImageDto)
  }

  async findAll(): Promise<DiagnosticImage[]> {
    return await this.diagnosticRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} diagnosticImage`;
  }

  update(id: number, updateDiagnosticImageDto: UpdateDiagnosticImageDto) {
    return `This action updates a #${id} diagnosticImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} diagnosticImage`;
  }
}
