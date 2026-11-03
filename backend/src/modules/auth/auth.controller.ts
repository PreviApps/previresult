import { Controller, Post, Get, Delete, Body, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('session')
  setSession(
    @Body() authPayloadDto: AuthPayloadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = this.authService.setSession(authPayloadDto);

    // Guardamos el ID de sesión en una cookie HttpOnly segura para este navegador
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hora
    });

    return { success: true, message: 'Sesión establecida correctamente' };
  }

  @Get('session')
  getSession(@Req() req: Request) {
    const sessionId = req.cookies?.session_id;
    if (!sessionId) {
      throw new UnauthorizedException('No hay sesión activa');
    }
    return this.authService.getSession(sessionId);
  }

  @Delete('session')
  clearSession(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies?.session_id;
    this.authService.clearSession(sessionId);

    // Borramos la cookie
    res.clearCookie('session_id');

    return { success: true, message: 'Sesión cerrada' };
  }
}