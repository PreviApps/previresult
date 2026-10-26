import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { plainToInstance } from "class-transformer";
import { AnnarResultsLaboratoryDto } from "src/modules/laboratories/dto/annar-results.dto";
import { FindResultsLaboratory } from "src/modules/laboratories/dto/find-results-laboratory.dto";

interface TokenInfo {
  token: string | null;
  expiresAt: number | null;
  promise: Promise<string> | null;
}

@Injectable()
export class AnnarService {
  private readonly logger = new Logger(AnnarService.name);

  // Mapa para gestionar tokens independientes por cada URL base
  private tokenStores: Map<string, TokenInfo> = new Map();

  private readonly annarUrls: string[];

  constructor(private readonly configService: ConfigService) {
    // Cargamos las 3 URLs de forma limpia
    this.annarUrls = [
      this.configService.get<string>('URL_BASE_ANNAR_CALIDAD_MEDICA'),
      this.configService.get<string>('URL_BASE_ANNAR_SALUD_SOCIAL'),
      this.configService.get<string>('URL_BASE_ANNAR_PROMOCOSTA'),
    ].filter(Boolean) as string[]; // Filtra por si alguna llega a faltar
  }

  private getTokenStore(baseUrl: string): TokenInfo {
    if (!this.tokenStores.has(baseUrl)) {
      this.tokenStores.set(baseUrl, { token: null, expiresAt: null, promise: null });
    }
    return this.tokenStores.get(baseUrl)!;
  }

  private async getValidToken(baseUrl: string): Promise<string> {
    const store = this.getTokenStore(baseUrl);
    const now = Date.now();
    const safetyBuffer = 60 * 1000; // Margen de seguridad de 1 minuto

    if (store.token && store.expiresAt && now < (store.expiresAt - safetyBuffer)) {
      return store.token;
    }

    if (store.promise) {
      return store.promise;
    }

    store.promise = this.requestNewToken(baseUrl)
      .finally(() => {
        store.promise = null;
      });

    return store.promise;
  }

  private async requestNewToken(baseUrl: string): Promise<string> {
    const store = this.getTokenStore(baseUrl);

    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.configService.get('USERNAME_ANNAR'),
        password: this.configService.get('PASSWORD_ANNAR')
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error al autenticar en Annar (${baseUrl}): ${errorBody}`);
    }

    const data = await response.json();
    store.token = data.token;
    store.expiresAt = this.getJwtExpiration(data.token);

    return store.token!;
  }

  private getJwtExpiration(token: string): number {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Token inválido');

      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      if (payload.exp) {
        return payload.exp * 1000;
      }
    } catch (error) {
      this.logger.warn('No se pudo leer la expiración del JWT, usando respaldo de 50 minutos');
    }

    return Date.now() + 50 * 60 * 1000;
  }

  /**
   * Consulta los resultados en una URL base específica con manejo de reintento por 401
   */
  private async fetchFromInstance(baseUrl: string, data: FindResultsLaboratory): Promise<AnnarResultsLaboratoryDto[]> {
    let token = await this.getValidToken(baseUrl);

    const makeRequest = async (currentToken: string) => {
      return fetch(`${baseUrl}/consultar_resultados`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          datos: {
            tipo_documento: data.tipo_documento,
            id_paci: data.id_paci,
            fecha_ini: data.fecha_ini,
            fecha_fin: data.fecha_fin
          }
        })
      });
    };

    let response = await makeRequest(token);

    // Si expiro el token, invalidamos y reintentamos una vez
    if (response.status === 401) {
      this.logger.warn(`[${baseUrl}] Token rechazado (401). Forzando renovación...`);
      const store = this.getTokenStore(baseUrl);
      store.token = null;
      store.expiresAt = null;

      token = await this.getValidToken(baseUrl);
      response = await makeRequest(token);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      try {
        const parsedError = JSON.parse(errorBody);
        if (parsedError.codigo === 404 || response.status === 404) {
          this.logger.log(`[${baseUrl}] Sin resultados para el paciente.`);
          return [];
        }
      } catch (e) {
        // No era JSON, continúa
      }
      throw new Error(`Error en ${baseUrl}: ${response.statusText}`);
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) return [];

    return rawData.map(item =>
      plainToInstance(AnnarResultsLaboratoryDto, item, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Consulta en paralelo las 3 bases de datos y consolida los resultados
   */
  async getPatientResults(data: FindResultsLaboratory): Promise<AnnarResultsLaboratoryDto[]> {
    this.logger.log(`Consultando resultados para paciente ID: ${data.id_paci} en ${this.annarUrls.length} instancias de Annar...`);

    // Lanzamos todas las peticiones en paralelo
    const promises = this.annarUrls.map(baseUrl => 
      this.fetchFromInstance(baseUrl, data).catch(err => {
        this.logger.error(`Fallo al consultar la instancia ${baseUrl}: ${err.message}`);
        // Retornamos array vacío si una instancia falla, para no tumbar la consolidación completa
        return [];
      })
    );

    const resultsArray = await Promise.all(promises);

    // Unimos y aplanamos los resultados de las 3 fuentes en un solo array consolidado
    const consolidatedResults = resultsArray.flat();

    this.logger.log(`Consulta finalizada. Total de resultados consolidados: ${consolidatedResults.length}`);

    return consolidatedResults;
  }
}