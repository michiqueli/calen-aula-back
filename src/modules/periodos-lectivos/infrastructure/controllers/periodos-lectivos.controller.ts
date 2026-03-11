import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PeriodosLectivosService } from '../../application/services/periodos-lectivos.service.js';
import { CreatePeriodoLectivoDto } from '../../application/dtos/create-periodo-lectivo.dto.js';
import { PeriodoLectivo } from '../../domain/entities/periodo-lectivo.entity.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';

/**
 * Controlador para gestión de periodos lectivos.
 */
@ApiTags('Periodos Lectivos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('periodos-lectivos')
export class PeriodosLectivosController {
  constructor(private readonly service: PeriodosLectivosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar periodos lectivos' })
  @ApiResponse({ status: 200, description: 'Lista de periodos lectivos', type: [PeriodoLectivo] })
  async findAll(
    @CurrentUser() _user?: JwtPayload,
  ): Promise<PeriodoLectivo[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear periodo lectivo' })
  @ApiResponse({ status: 201, description: 'Periodo lectivo creado', type: PeriodoLectivo })
  async create(
    @Body() dto: CreatePeriodoLectivoDto,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<PeriodoLectivo> {
    return this.service.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar periodo lectivo' })
  @ApiResponse({ status: 200, description: 'Periodo lectivo eliminado' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<void> {
    return this.service.delete(id);
  }
}
