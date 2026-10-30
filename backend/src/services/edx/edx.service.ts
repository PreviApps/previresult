import { BadGatewayException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosError } from "axios";

@Injectable()
export class EDXService {

  constructor(
    private readonly configService: ConfigService
  ) { }

  /*async getDiagnosticImageDICOM(report_id: string | number, studyInstanceUIDs: string) {
    try {
      const tokenData = await this.getToken(report_id);
      const token = tokenData?.token;

      if (!token) {
        throw new BadGatewayException('No se pudo obtener un token de autenticación válido para DICOM');
      }

      const response = await fetch(`${this.configService.get('EDX_DICOM_URL')}?StudyInstanceUIDs=${studyInstanceUIDs}&auth_token=${token}`);

      if (!response.ok) {
        throw new BadGatewayException(`Error al obtener las imágenes DICOM desde el servidor externo (Status: ${response.status})`);
      }

      return await response.text();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadGatewayException) throw error;
      throw new InternalServerErrorException('Error de comunicación al solicitar las imágenes DICOM');
    }
  }*/

  async getDiagnosticImageDICOM(report_id: string | number, studyInstanceUIDs: string) {
    try {
      const tokenData = await this.getToken(report_id);
      const token = tokenData?.token;

      if (!token) {
        throw new BadGatewayException('No se pudo obtener un token de autenticación válido para DICOM');
      }

      const dicomBaseUrl = this.configService.get('EDX_DICOM_URL');
      if (!dicomBaseUrl) {
        throw new InternalServerErrorException('La URL del visor DICOM no está configurada');
      }

      // Construimos la URL oficial del visor con su token y parámetros
      const dicomUrl = `${dicomBaseUrl}?StudyInstanceUIDs=${studyInstanceUIDs}&auth_token=${token}`;

      // Retornamos un objeto JSON con la url para que el frontend la abra directamente
      return { url: dicomUrl };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadGatewayException) throw error;
      throw new InternalServerErrorException('Error de comunicación al solicitar las imágenes DICOM');
    }
  }

  private async getToken(report_id: string | number) {
    try {
      const response = await fetch(`${this.configService.get('URL_BASE_EDX')}/work_orders/${report_id}/generate_jwt`, {
        headers: this.getBaseHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException(`No se encontró la orden con ID ${report_id} para generar el token DICOM`);
        }
        throw new BadGatewayException(`Error al generar el token JWT en EDX (Status: ${response.status})`);
      }

      const data = await response.json();

      if (!data || !data.token) {
        throw new BadGatewayException('La respuesta del token JWT no contiene la estructura esperada');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadGatewayException) throw error;
      throw new InternalServerErrorException('Error de comunicación al solicitar el token DICOM');
    }
  }

  async getDocument(report_id: string | number) {
    try {
      const response = await fetch(`${this.configService.get('URL_BASE_EDX')}/reports/${report_id}/get_pdf`, {
        headers: this.getBaseHeaders()
      });

      if (!response.ok) {
        throw new BadGatewayException(`Error al obtener el PDF desde EDX (Status: ${response.status})`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;
      throw new InternalServerErrorException('Error de comunicación al solicitar el documento PDF');
    }
  }

  async getSummaryPerReport(report_id: string | number) {
    try {
      const response = await fetch(`${this.configService.get('URL_BASE_EDX')}/reports/${report_id}`, {
        headers: this.getBaseHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException(`No se encontró el reporte con ID ${report_id}`);
        }
        throw new BadGatewayException(`Error en el servicio EDX al consultar el reporte (Status: ${response.status})`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadGatewayException) throw error;
      throw new InternalServerErrorException('Error al conectar con el servicio de reportes');
    }
  }

  async getOrdersPerPatient(tipoDoc: string, numDoc: string) {
    const patientData = await this.getPatientDetails(tipoDoc, numDoc);

    // Validación segura de pacientes encontrados
    if (!patientData || patientData.message === 'patients not found' || !patientData.patients || patientData.patients.length === 0) {
      throw new NotFoundException('Paciente no encontrado en el sistema externo');
    }

    const patient = patientData.patients[0];
    const idPatient = patient.id;

    const orders = await this.listOrdersPerPatient(idPatient);

    if (!orders || !orders.work_orders || !Array.isArray(orders.work_orders)) {
      throw new NotFoundException('No se encontraron órdenes de trabajo para este paciente');
    }

    const filteredOrders = orders.work_orders.filter(
      (order) => order && order.report_id !== null && order.report_id !== undefined
    );

    return {
      patient,
      filteredOrders
    };
  }

  private async listOrdersPerPatient(idPatient: number) {
    try {
      const response = await fetch(`${this.configService.get('URL_BASE_EDX')}/patients/${idPatient}/work_orders`, {
        headers: this.getBaseHeaders()
      });

      if (!response.ok) {
        throw new BadGatewayException(`Error al listar órdenes (Status: ${response.status})`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;
      throw new InternalServerErrorException('Error al consultar las órdenes del paciente');
    }
  }


  private async getPatientDetails(tipoDoc: string, numDoc: string) {
    try {
      const response = await axios.get(`${this.configService.get('URL_BASE_EDX')}/patients`, {
        headers: this.getBaseHeaders(),
        data: JSON.stringify({
          patient_attributes: {
            document_type: tipoDoc,
            patident: numDoc
          }
        })
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      // Si EDX responde con un 404 controlado
      if (axiosError.response?.status === 404) {
        return { message: 'patients not found', patients: [] };
      }

      throw new BadGatewayException('Error de comunicación con el servicio de pacientes de EDX');
    }
  }

  private getBaseHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-AUTH-TOKEN': `${this.configService.get('EDX_X_AUTH_TOKEN')}`,
      'Authorization': `Basic ${this.configService.get('EDX_BASIC_AUTHORIZATION')}`
    };
  }

}