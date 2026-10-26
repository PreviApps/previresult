import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SignaturesService } from './signatures.service';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) { }

  @Get(':usrCodigo')
  async obtenerFirma(
    @Param('usrCodigo') usrCodigo: string,
    @Query('instancia') instancia?: string,
  ) {
    // Si mandan la instancia específica, busca ahí. Si no, barre las 3 en paralelo.
    if (instancia) {
      return await this.signaturesService.obtenerFirmaPorCodigo(instancia, usrCodigo);
    }
    return await this.signaturesService.obtenerFirmaEnTodasLasInstancias(usrCodigo);
  }

}
