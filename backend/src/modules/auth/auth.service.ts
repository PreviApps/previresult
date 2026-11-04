import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) { }

  setSession(payload: AuthPayloadDto): string {
    return this.jwtService.sign(payload);
  }

  getSession(token: string): AuthPayloadDto {
    try {
      const payload = this.jwtService.verify<AuthPayloadDto>(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('No hay una sesión activa válida o ha expirado');
    }
  }

  clearSession(sessionId?: string) {
    return { success: true, message: 'Sesión cerrada correctamente' };
  }
}