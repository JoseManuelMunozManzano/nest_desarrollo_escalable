import axios from 'axios';
import { Move, PokeapiResponse } from '../interfaces/pokeapi-response.interface';

export class Pokemon {
  constructor(
    public readonly id: number,
    public name: string // Todo: inyectar dependencias
  ) {}

  get imageUrl(): string {
    return `https://pokemon.com/${this.id}.jpg`;
  }

  scream() {
    console.log(`${this.name.toUpperCase()}!!!`);
  }

  speak() {
    console.log(`${this.name}, ${this.name}`);
  }

  // Método asíncrono: método que regresa una promesa
  //
  // PROBLEMA:
  // Código fuertemente acoplado a una dependencia de terceros (axios.get)
  // Si Axios cambiara el método get a, por ejemplo, getApi, se tendría que cambiar en un montón de sitios.
  // Se usará inyección de dependencias para resolver esto (ver siguiente punto 05-injection.ts)
  async getMoves(): Promise<Move[]> {
    const { data } = await axios.get<PokeapiResponse>('https://pokeapi.co/api/v2/pokemon/4');
    console.log(data.moves);

    return data.moves;
  }
}

export const charmander = new Pokemon(4, 'Charmander');
