import { Controller, Post, Get, Delete, Body, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('session')
  setSession(
    @Body() authPayloadDto: AuthPayloadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Genera el token JWT firmado con los datos del usuario
    const token = this.authService.setSession(authPayloadDto);

    // Guardamos el token en una cookie HttpOnly segura
    res.cookie('session_id', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.previsalud.com.co',
      maxAge: 3600000, // 1 hora
    });

    return { success: true, message: 'Sesión establecida correctamente' };
  }

  @Get('session')
  getSession(@Req() req: Request) {
    const token = req.cookies?.session_id;
    if (!token) {
      throw new UnauthorizedException('No hay sesión activa');
    }
    // Verifica el JWT y retorna los datos decodificados
    return this.authService.getSession(token);
  }

  @Delete('session')
  clearSession(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.session_id;
    this.authService.clearSession(token);

    // Borramos la cookie especificando el dominio y los flags para que el navegador la elimine con éxito
    res.clearCookie('session_id', {
      domain: '.previsalud.com.co',
      secure: true,
      sameSite: 'none',
    });

    return { success: true, message: 'Sesión cerrada' };
  }
}