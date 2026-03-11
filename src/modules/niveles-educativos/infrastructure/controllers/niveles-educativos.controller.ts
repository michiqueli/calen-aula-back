import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NivelesEducativosService } from '../../application/services/niveles-educativos.service.js';
import { CreateNivelEducativoDto } from '../../application/dtos/create-nivel-educativo.dto.js';
import { UpdateNivelEducativoDto } from '../../application/dtos/update-nivel-educativo.dto.js';
import { NivelEducativo } from '../../domain/entities/nivel-educativo.entity.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';

/**
 * Controlador para gestión de niveles educativos.
 */
@ApiTags('Niveles Educativos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('niveles-educativos')
export class NivelesEducativosController {
  constructor(private readonly service: NivelesEducativosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar niveles educativos' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Filtrar solo activos' })
  @ApiResponse({ status: 200, description: 'Lista de niveles educativos', type: [NivelEducativo] })
  async findAll(
    @Query('activeOnly') activeOnly?: string,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<NivelEducativo[]> {
    if (activeOnly === 'true') {
      return this.service.findAllActive();
    }
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener nivel educativo por ID' })
  @ApiResponse({ status: 200, description: 'Nivel educativo encontrado', type: NivelEducativo })
  @ApiResponse({ status: 404, description: 'Nivel educativo no encontrado' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<NivelEducativo> {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nivel educativo' })
  @ApiResponse({ status: 201, description: 'Nivel educativo creado', type: NivelEducativo })
  async create(
    @Body() dto: CreateNivelEducativoDto,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<NivelEducativo> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar nivel educativo' })
  @ApiResponse({ status: 200, description: 'Nivel educativo actualizado', type: NivelEducativo })
  @ApiResponse({ status: 404, description: 'Nivel educativo no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNivelEducativoDto,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<NivelEducativo> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar nivel educativo' })
  @ApiResponse({ status: 200, description: 'Nivel educativo eliminado' })
  @ApiResponse({ status: 404, description: 'Nivel educativo no encontrado' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() _user?: JwtPayload,
  ): Promise<void> {
    return this.service.delete(id);
  }
}
