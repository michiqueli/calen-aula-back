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
import { AnexoService } from '../../application/services/anexo.service.js';
import { CreateAnexoDto } from '../../application/dtos/create-anexo.dto.js';
import { UpdateAnexoDto } from '../../application/dtos/update-anexo.dto.js';
import { Anexo } from '../../domain/entities/anexo.entity.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';

/**
 * Controlador de anexos.
 */
@ApiTags('Anexos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('anexos')
export class AnexoController {
  constructor(private readonly anexoService: AnexoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los anexos del usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de anexos con fechas importantes', type: [Anexo] })
  async findAll(@CurrentUser() user: JwtPayload): Promise<Anexo[]> {
    return this.anexoService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un anexo por ID' })
  @ApiResponse({ status: 200, description: 'Anexo encontrado', type: Anexo })
  @ApiResponse({ status: 404, description: 'Anexo no encontrado' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Anexo> {
    return this.anexoService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo anexo' })
  @ApiResponse({ status: 201, description: 'Anexo creado', type: Anexo })
  @ApiResponse({ status: 409, description: 'Ya existe un anexo con ese número' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateAnexoDto,
  ): Promise<Anexo> {
    return this.anexoService.create(user.sub, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un anexo' })
  @ApiResponse({ status: 200, description: 'Anexo actualizado', type: Anexo })
  @ApiResponse({ status: 404, description: 'Anexo no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnexoDto,
  ): Promise<Anexo> {
    return this.anexoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un anexo' })
  @ApiResponse({ status: 200, description: 'Anexo eliminado' })
  @ApiResponse({ status: 404, description: 'Anexo no encontrado' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.anexoService.delete(id);
  }
}
