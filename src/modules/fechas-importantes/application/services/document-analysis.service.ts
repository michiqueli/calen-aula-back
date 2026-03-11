import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
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
  periodoNombre: string | null;
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

    // Definimos el esquema estricto que debe devolver Gemini
    const responseSchema: Schema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          titulo: {
            type: SchemaType.STRING,
            description: "Nombre del evento o período",
          },
          fechaInicio: {
            type: SchemaType.STRING,
            description: "Fecha de inicio exacta en formato YYYY-MM-DD",
          },
          fechaFin: {
            type: SchemaType.STRING,
            nullable: true,
            description: "Fecha de fin en formato YYYY-MM-DD, o null si es un solo día",
          },
          periodoNombre: {
            type: SchemaType.STRING,
            nullable: true,
            description: "Nombre del calendario (ej: Febrero-Diciembre, Marzo-Diciembre) o null",
          },
        },
        required: ["titulo", "fechaInicio", "fechaFin", "periodoNombre"],
      },
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // Te sugiero usar la 2.5 que es más precisa
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema, // <-- Magia acá
      }
    });

    const prompt = `Eres un asistente especializado en extraer fechas de documentos oficiales del calendario escolar argentino (resoluciones del Consejo Provincial de Educación de Neuquén).

Analiza el siguiente documento y extrae TODAS las fechas importantes. Este tipo de documentos contiene:

PERÍODOS LECTIVOS (MUY IMPORTANTES - siempre tienen fechas concretas de inicio y fin):
- Período Escolar, Período Lectivo, Término Lectivo para cada nivel (Inicial, Primario, Secundario, Superior)
- Vienen organizados por calendario: "Febrero-Diciembre", "Marzo-Diciembre", "Septiembre-Mayo"
- Cada uno tiene una fecha exacta de inicio y fin (ej: "del 17 de febrero al 19 de diciembre")

OTROS EVENTOS CON FECHAS:
- Recesos de invierno y verano (con rangos de fechas)
- Jornadas institucionales
- Feriados nacionales y provinciales
- Aniversarios de localidades
- Fechas límite administrativas
- Actos escolares obligatorios
- Presentación de docentes / personal

REGLAS:
1. Cada evento DEBE tener una fecha concreta (día/mes/año). El campo fechaInicio es OBLIGATORIO.
2. Si un evento tiene rango de fechas, usar fechaInicio y fechaFin.
3. Si solo es un día, fechaFin debe ser null.
4. Inferir el año del contexto del documento.
5. Para períodos lectivos/escolares, incluir en periodoNombre el nombre del calendario al que pertenecen. Si no aplica, usar null.

Documento:
${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      // Como usamos responseMimeType y responseSchema, el texto YA es un JSON puro y válido
      const parsed = JSON.parse(responseText);

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
          fechaFin: item.fechaFin && dateRegex.test(String(item.fechaFin)) ? String(item.fechaFin) : null,
          periodoNombre: item.periodoNombre ? String(item.periodoNombre) : null,
        }));
    } catch (error) {
      console.error("Error parseando respuesta de Gemini:", error);
      throw new BadRequestException(
        'No se pudieron extraer las fechas del documento. Intenta de nuevo.',
      );
    }
  }
}
