// Se instala axios
//  yarn add axios
// para recuperar la data (también se puede usar fetch directamente desde la versión 18 de Node)
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import axios, { AxiosInstance } from 'axios';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  // Luego se implementará usando el patrón adaptador y un custom provider para poder sustituir axios por request o
  // fetch API o cualquier paquete que nos sirva para generar peticiones http.
  // Así no tendremos aquí esta dependencia.
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    // Borramos los datos antes de volver a generarlos para evitar clave duplicada.
    // Esto es lo mismo que: DELETE FROM POKEMONS;
    // Sin WHERE
    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=3',
    );

    // Forma 1 de resolver el problema de insertar de forma simultanea:
    // Generar promesas y luego resolverlas todas a la vez.
    const insertPromisesArray = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      // No usamos pokemon.service.ts sino el create que proporciona mongoose, ya que es
      // la dependencia que hemos inyectado.
      // Problema: se hacen las inserciones de 1 en 1. Muy lento. Se debe hacer simultaneamente.
      //await this.pokemonModel.create({ name, no });
      //
      // La promesa se guarda (no ha terminado)
      insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    });

    // Ahora que tengo todas mis promesas guardadas, las resuelvo a la vez.
    // Problema: guardamos muchas veces en el array insertPromisesArray.
    await Promise.all(insertPromisesArray);

    return 'Seed executed!';
  }
}
