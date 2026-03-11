import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_PORT, AuthPort } from '../../domain/ports/auth.port.js';
import { SignupDto } from '../dtos/signup.dto.js';
import { LoginDto } from '../dtos/login.dto.js';
import { UpdateProfileDto } from '../dtos/update-profile.dto.js';
import { AuthResponseDto } from '../dtos/auth-response.dto.js';
import { User } from '../../domain/entities/user.entity.js';

/**
 * Servicio de aplicación para autenticación.
 * Orquesta registro, login y gestión de perfil.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_PORT)
    private readonly authPort: AuthPort,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema.
   * @throws ConflictException si el email ya existe
   */
  async signup(dto: SignupDto): Promise<AuthResponseDto> {
    const existing = await this.authPort.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.authPort.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
    });

    return this.buildAuthResponse(user);
  }

  /**
   * Inicia sesión con email y contraseña.
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authPort.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.buildAuthResponse(user);
  }

  /**
   * Obtiene los datos del usuario actual.
   */
  async getProfile(userId: string): Promise<User> {
    const user = await this.authPort.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Actualiza el perfil del usuario autenticado.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const updateData: Partial<User> = {};

    if (dto.email) {
      const existing = await this.authPort.findByEmail(dto.email);
      if (existing && existing.id !== userId) {
        throw new ConflictException('El email ya está en uso');
      }
      updateData.email = dto.email;
    }

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.fullName) {
      updateData.fullName = dto.fullName;
    }

    return this.authPort.update(userId, updateData);
  }

  private buildAuthResponse(user: User): AuthResponseDto {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
