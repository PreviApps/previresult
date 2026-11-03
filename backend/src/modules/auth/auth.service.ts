import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Injectable()
export class AuthService {
  private currentSession: AuthPayloadDto | null = null;

  setSession(payload: AuthPayloadDto) {
    this.currentSession = payload;
    return {
      success: true,
      message: 'Sesión establecida correctamente',
      session: payload,
    };
  }

  getSession() {
    if (!this.currentSession) {
      throw new NotFoundException('No hay ninguna sesión activa en el sistema');
    }
    return this.currentSession;
  }

  clearSession() {
    this.currentSession = null;
    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
  }
}
