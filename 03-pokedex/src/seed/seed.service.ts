// Se instala axios
//  yarn add axios
// para recuperar la data (también se puede usar fetch directamente desde la versión 18 de Node)
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // Custom Provider. La idea es poder cambiar axios por fetch o por otro fácilmente.
  // Un Custom Provider utiliza el patrón Adaptador.
  // Vamos a crear un adaptador que va a envolver axios para desacoplar esta dependencia de aquí.
  // Este custom provider lo vamos a crear dentro de la carpeta common (en adapters), porque puede ser que en otros
  // módulos también necesitemos hacer peticiones http, y entonces también usaremos este custom provider.
  // Es un provider porque va a poder inyectarse.

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    // Borramos los datos antes de volver a generarlos para evitar clave duplicada.
    // Esto es lo mismo que: DELETE FROM POKEMONS;
    // Sin WHERE
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // RECOMENDADO: Forma 2 de resolver el problema de insertar de forma simultanea:
    // Usando mongoose
    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      // Se guarda el dato del pokemon
      pokemonToInsert.push({ name, no });
    });

    // Ahora que tengo todos los datos de mis pokemon, uso mongoose para guardarlos todos a la vez.
    // Solo hace una inserción (con las promesas había muchas inserciones)
    // La inserción sería algo así:
    // INSERT INTO POKEMONS (name, no)
    // (name: bulbasaur, no: 1)
    // (name: bulbasaur, no: 1)
    // (name: bulbasaur, no: 1)
    // (name: bulbasaur, no: 1)
    // (name: bulbasaur, no: 1)
    this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed!';
  }
}
