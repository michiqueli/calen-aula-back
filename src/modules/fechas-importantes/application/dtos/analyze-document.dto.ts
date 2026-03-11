import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeDocumentDto {
  @ApiProperty({ description: 'ID del archivo anexo a analizar' })
  @IsUUID()
  archivoAnexoId: string;
}
