// Se instala axios
//  yarn add axios
// para recuperar la data (también se puede usar fetch directamente desde la versión 18 de Node)
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  // Luego se implementará usando el patrón adaptador y un custom provider para poder sustituir axios por request o
  // fetch API o cualquier paquete que nos sirva para generar peticiones http.
  // Así no tendremos aquí esta dependencia.
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      console.log({ name, no });
    });

    return data.results;
  }
}
