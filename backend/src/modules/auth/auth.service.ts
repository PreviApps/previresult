import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  // Almacén en memoria simulando una sesión por ID
  private sessions = new Map<string, AuthPayloadDto>();

  setSession(payload: AuthPayloadDto): string {
    const sessionId = crypto.randomUUID(); // Genera un ID único para este usuario
    this.sessions.set(sessionId, payload);
    return sessionId;
  }

  getSession(sessionId: string): AuthPayloadDto {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new UnauthorizedException('No hay una sesión activa válida');
    }
    return session;
  }

  clearSession(sessionId: string) {
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
    return { success: true, message: 'Sesión cerrada correctamente' };
  }
}