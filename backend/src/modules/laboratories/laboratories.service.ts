import { Injectable } from '@nestjs/common';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';
import { AnnarService } from 'src/services/annar/annar.service';
import { FindResultsLaboratory } from './dto/find-results-laboratory.dto';

@Injectable()
export class LaboratoriesService {

  constructor(
    private readonly annarService: AnnarService
  ){}

  create(createLaboratoryDto: CreateLaboratoryDto) {
    return 'This action adds a new laboratory';
  }

  async findAll(findResultsLaboratory: FindResultsLaboratory) {
    return await this.annarService.getPatientResults(findResultsLaboratory);
  }

  findOne(id: number) {
    return `This action returns a #${id} laboratory`;
  }

  update(id: number, updateLaboratoryDto: UpdateLaboratoryDto) {
    return `This action updates a #${id} laboratory`;
  }

  remove(id: number) {
    return `This action removes a #${id} laboratory`;
  }

}
