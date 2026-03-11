import {
  Controller,
  Get,
  Post,
  Put,
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
import { RangosLectivosService } from '../../application/services/rangos-lectivos.service.js';
import { CreateRangoLectivoDto } from '../../application/dtos/create-rango-lectivo.dto.js';
import { UpdateRangoLectivoDto } from '../../application/dtos/update-rango-lectivo.dto.js';
import { RangoLectivo } from '../../domain/entities/rango-lectivo.entity.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';

/**
 * Controlador para gestión de rangos lectivos.
 */
@ApiTags('Rangos Lectivos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('rangos-lectivos')
export class RangosLectivosController {
  constructor(private readonly service: RangosLectivosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar rangos lectivos' })
  @ApiResponse({ status: 200, description: 'Lista de rangos lectivos', type: [RangoLectivo] })
  async findAll(
    @CurrentUser() _user?: JwtPayload,
  ): Promise<RangoLectivo[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear rango lectivo' })
  @ApiResponse({ status: 201, description: 'Rango lectivo creado', type: RangoLectivo })
  async create(
    @Body() dto: CreateRangoLectivoDto,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<RangoLectivo> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar rango lectivo' })
  @ApiResponse({ status: 200, description: 'Rango lectivo actualizado', type: RangoLectivo })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRangoLectivoDto,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<RangoLectivo> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar rango lectivo' })
  @ApiResponse({ status: 200, description: 'Rango lectivo eliminado' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<void> {
    return this.service.delete(id);
  }
}
