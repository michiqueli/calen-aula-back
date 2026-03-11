import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFParse } from 'pdf-parse';
import {
  StoragePort,
  STORAGE_PORT,
} from '../../../storage/domain/ports/storage.port.js';
import {
  ARCHIVOS_ANEXOS_PORT,
  ArchivosAnexosPort,
} from '../../../archivos-anexos/domain/ports/archivos-anexos.port.js';

export interface ExtractedFecha {
  titulo: string;
  fechaInicio: string;
  fechaFin: string | null;
}

@Injectable()
export class DocumentAnalysisService {
  private readonly bucket: string;

  constructor(
    @Inject(STORAGE_PORT)
    private readonly storagePort: StoragePort,
    @Inject(ARCHIVOS_ANEXOS_PORT)
    private readonly archivosAnexosPort: ArchivosAnexosPort,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get<string>(
      's3.bucketAnexoFiles',
      'anexo-files',
    );
  }

  async analyzeDocument(
    archivoAnexoId: string,
    userId: string,
  ): Promise<ExtractedFecha[]> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new BadRequestException(
        'GEMINI_API_KEY no está configurada en el servidor',
      );
    }

    const archivo = await this.archivosAnexosPort.findById(archivoAnexoId);
    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const fileBuffer = await this.storagePort.getObject(
      this.bucket,
      archivo.filePath,
    );

    let textContent: string;

    if (archivo.fileType === 'application/pdf') {
      const parser = new PDFParse({ data: new Uint8Array(fileBuffer) });
      const pdfData = await parser.getText();
      textContent = pdfData.text;
    } else if (
      archivo.fileType?.startsWith('text/') ||
      archivo.fileType === 'application/rtf'
    ) {
      textContent = fileBuffer.toString('utf-8');
    } else {
      throw new BadRequestException(
        `Tipo de archivo no soportado para análisis: ${archivo.fileType}. ` +
          'Se aceptan archivos PDF o de texto.',
      );
    }

    if (!textContent || textContent.trim().length < 10) {
      throw new BadRequestException(
        'No se pudo extraer texto suficiente del documento',
      );
    }

    // Truncate to avoid token limits
    const maxChars = 30000;
    const truncatedText =
      textContent.length > maxChars
        ? textContent.substring(0, maxChars) + '\n[...documento truncado...]'
        : textContent;

    return this.extractDatesWithGemini(apiKey, truncatedText);
  }

  private async extractDatesWithGemini(
    apiKey: string,
    text: string,
  ): Promise<ExtractedFecha[]> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Analiza el siguiente documento académico/educativo y extrae TODAS las fechas importantes que encuentres.

Para cada fecha importante, identifica:
- Un título descriptivo corto
- La fecha de inicio (formato YYYY-MM-DD)
- La fecha de fin si es un rango (formato YYYY-MM-DD), o null si es un solo día

Busca eventos como:
- Inicio/fin de clases o cuatrimestres
- Fechas de exámenes parciales y finales
- Períodos de inscripción
- Feriados y recesos
- Entregas de trabajos prácticos
- Cualquier otra fecha relevante mencionada

IMPORTANTE: Responde ÚNICAMENTE con un JSON array válido, sin markdown ni texto adicional.
Formato exacto:
[{"titulo": "string", "fechaInicio": "YYYY-MM-DD", "fechaFin": "YYYY-MM-DD o null"}]

Si no encuentras ninguna fecha, responde con un array vacío: []

Documento:
${text}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean response - remove markdown code blocks if present
    const cleaned = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .filter(
          (item: any) =>
            item.titulo &&
            item.fechaInicio &&
            /^\d{4}-\d{2}-\d{2}$/.test(item.fechaInicio),
        )
        .map((item: any) => ({
          titulo: String(item.titulo),
          fechaInicio: item.fechaInicio,
          fechaFin:
            item.fechaFin && /^\d{4}-\d{2}-\d{2}$/.test(item.fechaFin)
              ? item.fechaFin
              : null,
        }));
    } catch {
      throw new BadRequestException(
        'No se pudieron extraer las fechas del documento. Intenta de nuevo.',
      );
    }
  }
}
