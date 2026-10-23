import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LaboratoriesModule } from './modules/laboratories/laboratories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    LaboratoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
