import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

// Custom Provider.
// Si axios cambia, solo debería tener que tocar esta clase.
//
// No olvidar @Injectable() para poder inyectarlo en otros servicios.
// Además, estos inyectables son visibles a nivel de módulo. Si necesitamos que otros módulos lo vean, tenemos que
// definirlo como provider y exportarlo en common.module.ts e importar el módulo common.module.ts en los módulos
// donde necesitemos este adaptador, como seed.module.ts
@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      // Luego veremos como revisar estos logs y como trabajar con un logger que viene incrustado en Nest para poder
      // hacer nuestros mensajes de logs.
      throw new Error('This is an error - Check logs');
    }
  }
}
