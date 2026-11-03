import { Controller, Post, Get, Body, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('session')
  setSession(@Body() authPayloadDto: AuthPayloadDto) {
    return this.authService.setSession(authPayloadDto);
  }

  @Get('session')
  getSession() {
    return this.authService.getSession();
  }

  @Delete('session')
  clearSession() {
    return this.authService.clearSession();
  }
}