import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiagnosticImagesService } from './diagnostic-images.service';
import { CreateDiagnosticImageDto } from './dto/create-diagnostic-image.dto';
import { UpdateDiagnosticImageDto } from './dto/update-diagnostic-image.dto';

@Controller('diagnostic-images')
export class DiagnosticImagesController {
  constructor(private readonly diagnosticImagesService: DiagnosticImagesService) {}

  @Post()
  create(@Body() createDiagnosticImageDto: CreateDiagnosticImageDto) {
    return this.diagnosticImagesService.create(createDiagnosticImageDto);
  }

  @Get()
  findAll() {
    return this.diagnosticImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosticImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiagnosticImageDto: UpdateDiagnosticImageDto) {
    return this.diagnosticImagesService.update(+id, updateDiagnosticImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnosticImagesService.remove(+id);
  }
}
