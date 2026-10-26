import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LaboratoriesModule } from './modules/laboratories/laboratories.module';
import { SignaturesModule } from './modules/signatures/signatures.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistEntity } from './modules/signatures/entities/specialist.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      name: 'CALIDAD_MEDICA',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Ajusta según tu motor (postgres, mysql, etc.)
        url: configService.get<string>('DATABASE_URL_ANNAR_CALIDAD_MEDICA'),
        entities: [SpecialistEntity],
        synchronize: false, // ¡En producción siempre en false!
        //ssl: { rejectUnauthorized: false }, // Útil si están en la nube (Supabase, RDS, etc.)
      }),
    }),

    // 2. Conexión: SALUD SOCIAL
    TypeOrmModule.forRootAsync({
      name: 'SALUD_SOCIAL',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL_ANNAR_SALUD_SOCIAL'),
        entities: [SpecialistEntity],
        synchronize: false,
        //ssl: { rejectUnauthorized: false },
      }),
    }),

    // 3. Conexión: PROMOCOSTA
    TypeOrmModule.forRootAsync({
      name: 'PROMOCOSTA',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL_ANNAR_PROMOCOSTA'),
        entities: [SpecialistEntity],
        synchronize: false,
        //ssl: { rejectUnauthorized: false },
      }),
    }),
    LaboratoriesModule, SignaturesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
