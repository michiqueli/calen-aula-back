import { PartialType } from '@nestjs/swagger';
import { CreateNivelEducativoDto } from './create-nivel-educativo.dto.js';

/**
 * DTO para actualizar un nivel educativo.
 * Todos los campos son opcionales.
 */
export class UpdateNivelEducativoDto extends PartialType(CreateNivelEducativoDto) {}
