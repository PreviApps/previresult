import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ILike } from 'typeorm';
import { SpecialistEntity } from './entities/specialist.entity';

@Injectable()
export class SignaturesService {

  constructor(
    @InjectDataSource('CALIDAD_MEDICA') private dsCalidadMedica: DataSource,
    @InjectDataSource('SALUD_SOCIAL') private dsSaludSocial: DataSource,
    @InjectDataSource('PROMOCOSTA') private dsPromocosta: DataSource,
  ) { }

  private getDataSource(instancia: string): DataSource {
    switch (instancia?.toUpperCase()) {
      case 'CALIDAD_MEDICA': return this.dsCalidadMedica;
      case 'SALUD_SOCIAL': return this.dsSaludSocial;
      case 'PROMOCOSTA': return this.dsPromocosta;
      default: throw new BadRequestException(`Instancia desconocida: ${instancia}`);
    }
  }

  async obtenerFirmaPorCodigo(instancia: string, usrCodigo: string) {
    const dataSource = this.getDataSource(instancia);
    const medicoRepo = dataSource.getRepository(SpecialistEntity);

    const codigoLimpio = usrCodigo?.trim();

    // Consultamos usando la PK 'usr_codigo' con select en formato objeto
    const medico = await medicoRepo.findOne({
      where: { usrCodigo: ILike(codigoLimpio) },
      select: {
        usrCodigo: true,
        nombreCompleto: true,
        tipodctoCod: true,
        documento: true,
        profesion: true,
        firma: true,
      },
    });

    if (!medico) {
      throw new NotFoundException(`Médico con código ${usrCodigo} no encontrado en ${instancia}`);
    }


    // Tipamos explícitamente para permitir string o null
    let firmaDataUri: string | null = null;

    // Si la firma existe y es un Buffer, la convertimos a Base64 con Data URI JPEG
    if (medico.firma) {
      const base64String = Buffer.isBuffer(medico.firma)
        ? medico.firma.toString('base64')
        : Buffer.from(medico.firma).toString('base64');

      firmaDataUri = `data:image/jpeg;base64,${base64String}`;
    }

    return {
      usrCodigo: medico.usrCodigo,
      nombreCompleto: medico.nombreCompleto,
      tipodctoCod: medico.tipodctoCod,
      documento: medico.documento,
      profesion: medico.profesion,
      firma: firmaDataUri,
      instanciaOrigen: instancia
    };
  }

  // Busca en las 3 bases de datos en paralelo y prioriza la que tenga firma
  async obtenerFirmaEnTodasLasInstancias(usrCodigo: string) {
    const instancias = ['CALIDAD_MEDICA', 'SALUD_SOCIAL', 'PROMOCOSTA'];

    // Lanzamos las 3 consultas en paralelo
    const promises = instancias.map(instancia =>
      this.obtenerFirmaPorCodigo(instancia, usrCodigo).catch(err => {
        console.error(`⚠️ Error en la instancia [${instancia}]:`, err.message);
        return null;
      })
    );

    const resultados = await Promise.all(promises);

    // Filtramos únicamente los resultados exitosos (que no sean null)
    const validos = resultados.filter((res): res is NonNullable<typeof res> => res !== null);

    if (validos.length === 0) {
      throw new NotFoundException(`Firma con código ${usrCodigo} no fue encontrada en ninguna de las 3 instancias.`);
    }

    // 🏆 CLAVE: Buscamos primero si alguna de las instancias tiene la firma diferente de null
    const conFirma = validos.find(res => res.firma !== null);

    // Si encontramos una instancia con firma, retornamos esa. Si ninguna tiene firma, devolvemos la primera encontrada.
    return conFirma || validos[0];
  }
}
