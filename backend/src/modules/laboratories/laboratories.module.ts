import { Module } from '@nestjs/common';
import { LaboratoriesService } from './laboratories.service';
import { LaboratoriesController } from './laboratories.controller';
import { AnnarService } from 'src/services/annar/annar.service';

@Module({
  controllers: [LaboratoriesController],
  providers: [LaboratoriesService, AnnarService],
})
export class LaboratoriesModule {}
