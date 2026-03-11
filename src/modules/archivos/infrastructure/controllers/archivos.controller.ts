import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import {
  CurrentUser,
  JwtPayload,
} from '../../../../common/decorators/current-user.decorator.js';
import { ArchivosService } from '../../application/services/archivos.service.js';
import { UploadArchivoDto } from '../../application/dtos/upload-archivo.dto.js';
import { ArchivoResponseDto } from '../../application/dtos/archivo-response.dto.js';

/**
 * Controlador de archivos (biblioteca global).
 */
@ApiTags('Archivos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los archivos del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de archivos',
    type: [ArchivoResponseDto],
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async findAll(
    @CurrentUser() user: JwtPayload,
  ): Promise<ArchivoResponseDto[]> {
    return this.archivosService.findAll(user.sub);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Subir un archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir con metadatos',
    schema: {
      type: 'object',
      required: ['file', 'titulo'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir',
        },
        titulo: {
          type: 'string',
          description: 'Título del archivo',
          example: 'Mi documento',
        },
        descripcion: {
          type: 'string',
          description: 'Descripción opcional del archivo',
          example: 'Descripción opcional',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido exitosamente',
    type: ArchivoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadArchivoDto,
  ): Promise<ArchivoResponseDto> {
    return this.archivosService.upload(user.sub, file, dto);
  }

  @Get(':id/signed-url')
  @ApiOperation({ summary: 'Obtener URL firmada para previsualización' })
  @ApiQuery({
    name: 'expiresIn',
    required: false,
    type: Number,
    description: 'Tiempo de expiración en segundos (default: 3600)',
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
    return this.archivosService.getSignedUrl(id, expiry);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Obtener URL de descarga directa' })
  @ApiResponse({
    status: 200,
    description: 'URL de descarga generada',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://s3.example.com/download-url' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async download(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ url: string }> {
    return this.archivosService.download(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un archivo' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.archivosService.delete(id);
  }
}
