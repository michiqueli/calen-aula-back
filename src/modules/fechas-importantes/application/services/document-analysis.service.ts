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

    const prompt = `Eres un asistente especializado en extraer fechas de documentos oficiales del calendario escolar argentino (resoluciones del Consejo Provincial de Educación).

Analiza el siguiente documento y extrae TODAS las fechas concretas que encuentres. Este tipo de documentos suele contener:
- Inicio y fin del período lectivo / período escolar / término lectivo (con fechas exactas tipo "2 de marzo", "15 de diciembre")
- Recesos de invierno y verano (con rangos de fechas)
- Jornadas institucionales (con fecha exacta)
- Feriados nacionales y provinciales (con fecha exacta)
- Aniversarios de localidades (con fecha exacta)
- Fechas límite administrativas
- Actos escolares obligatorios
- Cualquier otra fecha concreta mencionada

REGLAS CRÍTICAS:
1. SOLO incluir eventos que tengan una FECHA CONCRETA (día/mes/año) en el documento.
2. NO incluir eventos que solo mencionan meses sin día específico (ej: "Febrero-Diciembre" sin día concreto).
3. NO incluir rangos genéricos como "período Marzo-Diciembre" si no hay fecha exacta de inicio/fin.
4. Si un evento tiene rango de fechas (ej: "del 14 al 25 de julio"), usar fechaInicio y fechaFin.
5. Si solo dice un día (ej: "24 de marzo"), fechaFin debe ser null.
6. El campo fechaInicio es OBLIGATORIO - nunca omitirlo.
7. Inferir el año del contexto del documento (generalmente el año lectivo mencionado).

Responde ÚNICAMENTE con un JSON array válido, sin markdown ni texto adicional.
Formato exacto:
[{"titulo": "Descripción corta del evento", "fechaInicio": "YYYY-MM-DD", "fechaFin": "YYYY-MM-DD o null"}]

Si no encuentras ninguna fecha concreta, responde: []

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

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return parsed
        .filter(
          (item: any) =>
            item.titulo &&
            item.fechaInicio &&
            dateRegex.test(String(item.fechaInicio)),
        )
        .map((item: any) => ({
          titulo: String(item.titulo),
          fechaInicio: String(item.fechaInicio),
          fechaFin:
            item.fechaFin && dateRegex.test(String(item.fechaFin))
              ? String(item.fechaFin)
              : null,
        }));
    } catch {
      throw new BadRequestException(
        'No se pudieron extraer las fechas del documento. Intenta de nuevo.',
      );
    }
  }
}
