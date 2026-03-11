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
import { FechaImportanteService } from '../../application/services/fecha-importante.service.js';
import { DocumentAnalysisService } from '../../application/services/document-analysis.service.js';
import { CreateFechaImportanteDto } from '../../application/dtos/create-fecha-importante.dto.js';
import { UpdateFechaImportanteDto } from '../../application/dtos/update-fecha-importante.dto.js';
import { BulkImportFechaDto } from '../../application/dtos/bulk-import-fecha.dto.js';
import { AnalyzeDocumentDto } from '../../application/dtos/analyze-document.dto.js';
import { FechaImportanteAnexo } from '../../domain/entities/fecha-importante-anexo.entity.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';

/**
 * Controlador de fechas importantes.
 */
@ApiTags('Fechas Importantes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('fechas-importantes')
export class FechaImportanteController {
  constructor(
    private readonly fechaImportanteService: FechaImportanteService,
    private readonly documentAnalysisService: DocumentAnalysisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar fechas importantes por anexo' })
  @ApiQuery({ name: 'anexoId', required: true, type: String, description: 'ID del anexo' })
  @ApiResponse({ status: 200, description: 'Lista de fechas importantes', type: [FechaImportanteAnexo] })
  async findByAnexo(
    @Query('anexoId', ParseUUIDPipe) anexoId: string,
  ): Promise<FechaImportanteAnexo[]> {
    return this.fechaImportanteService.findByAnexoId(anexoId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una fecha importante' })
  @ApiResponse({ status: 201, description: 'Fecha importante creada', type: FechaImportanteAnexo })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateFechaImportanteDto,
  ): Promise<FechaImportanteAnexo> {
    return this.fechaImportanteService.create(user.sub, dto);
  }

  @Post('bulk-import')
  @ApiOperation({ summary: 'Importación masiva de fechas importantes' })
  @ApiResponse({ status: 201, description: 'Fechas importadas', type: [FechaImportanteAnexo] })
  async bulkImport(
    @CurrentUser() user: JwtPayload,
    @Body() dto: BulkImportFechaDto,
  ): Promise<FechaImportanteAnexo[]> {
    return this.fechaImportanteService.bulkImport(user.sub, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una fecha importante' })
  @ApiResponse({ status: 200, description: 'Fecha importante actualizada', type: FechaImportanteAnexo })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFechaImportanteDto,
  ): Promise<FechaImportanteAnexo> {
    return this.fechaImportanteService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una fecha importante' })
  @ApiResponse({ status: 200, description: 'Fecha importante eliminada' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.fechaImportanteService.delete(id);
  }

  @Post('analyze-document')
  @ApiOperation({ summary: 'Analizar documento y extraer fechas importantes con IA' })
  @ApiResponse({ status: 200, description: 'Fechas extraídas del documento' })
  @ApiResponse({ status: 400, description: 'Tipo de archivo no soportado o error de análisis' })
  async analyzeDocument(
    @CurrentUser() user: JwtPayload,
    @Body() dto: AnalyzeDocumentDto,
  ) {
    return this.documentAnalysisService.analyzeDocument(
      dto.archivoAnexoId,
      user.sub,
    );
  }

  @Get('count-by-periodo/:periodoId')
  @ApiOperation({ summary: 'Contar fechas importantes por periodo' })
  @ApiResponse({ status: 200, description: 'Cantidad de fechas que usan el periodo' })
  async countByPeriodo(
    @Param('periodoId', ParseUUIDPipe) periodoId: string,
  ): Promise<{ count: number }> {
    const count = await this.fechaImportanteService.countByPeriodoId(periodoId);
    return { count };
  }
}
