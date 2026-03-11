import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import {
  CurrentUser,
  JwtPayload,
} from '../../../../common/decorators/current-user.decorator.js';
import { ArchivosAnexosService } from '../../application/services/archivos-anexos.service.js';
import { UpdateArchivoAnexoDto } from '../../application/dtos/update-archivo-anexo.dto.js';
import { ArchivoAnexoResponseDto } from '../../application/dtos/archivo-anexo-response.dto.js';

/**
 * Controlador para archivos adjuntos a anexos.
 * Gestiona upload, descarga y eliminación de archivos por anexo.
 */
@ApiTags('Archivos Anexos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('archivos-anexos')
export class ArchivosAnexosController {
  constructor(
    private readonly archivosAnexosService: ArchivosAnexosService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar archivos de anexos' })
  @ApiQuery({
    name: 'anexoId',
    required: false,
    type: String,
    description: 'Filtrar por ID de anexo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de archivos anexos',
    type: [ArchivoAnexoResponseDto],
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('anexoId') anexoId?: string,
  ): Promise<ArchivoAnexoResponseDto[]> {
    if (anexoId) {
      return this.archivosAnexosService.findByAnexoId(anexoId, user.sub);
    }
    return this.archivosAnexosService.findAll(user.sub);
  }

  @Post(':anexoId/upload')
  @ApiOperation({ summary: 'Subir archivo a un anexo' })
  @ApiParam({ name: 'anexoId', description: 'ID del anexo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido exitosamente',
    type: ArchivoAnexoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser() user: JwtPayload,
    @Param('anexoId', ParseUUIDPipe) anexoId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ArchivoAnexoResponseDto> {
    return this.archivosAnexosService.upload(user.sub, anexoId, file);
  }

  @Put(':id/title')
  @ApiOperation({ summary: 'Actualizar título de un archivo' })
  @ApiResponse({ status: 200, description: 'Título actualizado' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async updateTitle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateArchivoAnexoDto,
  ): Promise<void> {
    return this.archivosAnexosService.updateTitle(id, dto.nombreArchivo);
  }

  @Get(':id/signed-url')
  @ApiOperation({ summary: 'Obtener URL firmada para preview' })
  @ApiQuery({
    name: 'expiresIn',
    required: false,
    type: Number,
    description: 'Segundos de expiración (default: 3600)',
    example: 3600,
  })
  @ApiResponse({
    status: 200,
    description: 'URL firmada generada',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://s3.example.com/signed-url' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getSignedUrl(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('expiresIn') expiresIn?: string,
  ): Promise<{ url: string }> {
    const expiry = expiresIn ? parseInt(expiresIn, 10) : 3600;
    return this.archivosAnexosService.getSignedUrl(id, expiry);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un archivo de anexo' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.archivosAnexosService.delete(id);
  }
}
