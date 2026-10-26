import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LaboratoriesService } from './laboratories.service';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';
import { FindResultsLaboratory } from './dto/find-results-laboratory.dto';

@Controller('laboratories')
export class LaboratoriesController {
  constructor(private readonly laboratoriesService: LaboratoriesService) {}

  @Post()
  create(@Body() createLaboratoryDto: CreateLaboratoryDto) {
    return this.laboratoriesService.create(createLaboratoryDto);
  }

  @Post('find')
  findAll(@Body() findResultsLaboratory: FindResultsLaboratory) {
    return this.laboratoriesService.findAll(findResultsLaboratory);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laboratoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaboratoryDto: UpdateLaboratoryDto) {
    return this.laboratoriesService.update(+id, updateLaboratoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laboratoriesService.remove(+id);
  }
}
