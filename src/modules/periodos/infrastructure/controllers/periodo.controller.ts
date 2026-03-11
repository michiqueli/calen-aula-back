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
import { PeriodoService } from '../../application/services/periodo.service.js';
import { CreatePeriodoDto } from '../../application/dtos/create-periodo.dto.js';
import { Periodo } from '../../domain/entities/periodo.entity.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';

/**
 * Controlador de periodos.
 */
@ApiTags('Periodos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('periodos')
export class PeriodoController {
  constructor(private readonly periodoService: PeriodoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los periodos del usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de periodos', type: [Periodo] })
  async findAll(@CurrentUser() user: JwtPayload): Promise<Periodo[]> {
    return this.periodoService.findAll(user.sub);
  }

  @Get('by-anexo/:anexoId')
  @ApiOperation({ summary: 'Obtener periodos usados en un anexo' })
  @ApiResponse({ status: 200, description: 'Lista de periodos del anexo', type: [Periodo] })
  async findByAnexo(
    @Param('anexoId', ParseUUIDPipe) anexoId: string,
  ): Promise<Periodo[]> {
    return this.periodoService.findByAnexoId(anexoId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo periodo' })
  @ApiResponse({ status: 201, description: 'Periodo creado', type: Periodo })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePeriodoDto,
  ): Promise<Periodo> {
    return this.periodoService.create(user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un periodo' })
  @ApiResponse({ status: 200, description: 'Periodo eliminado' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.periodoService.delete(id);
  }
}
