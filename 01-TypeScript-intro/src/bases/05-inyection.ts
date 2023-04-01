import { HttpAdapter, PokeApiAdapter, PokeApiFetchAdapter } from '../api/pokeApi.adapter';
import { Move, PokeapiResponse } from '../interfaces/pokeapi-response.interface';

export class Pokemon {
  get imageUrl(): string {
    return `https://pokemon.com/${this.id}.jpg`;
  }

  // Se aplica el principio de inyección de dependencias para desacoplar la funcionalidad externa de
  // nuestra clase
  // Al constructor se le pasa private readonly http:PokeApiAdapter
  // constructor(public readonly id: number, public name: string, private readonly http: PokeApiAdapter) {}
  //
  // Y luego se aplica el principio de sustitución de Liskov: La clase de tipo PokeApiAdapter no debería estar
  // amarrada a una implementación específica. Se debería poder cambiar PokeAPiAdapter por cualquier otra
  // clase que también implemente el método get, y para nuestra clase Pokemon esto debería ser transparente.
  // Esto se puede resolver bien con una clase abstracta, que no se usan tanto en Nest o con una interface, HttpAdapter en este caso.
  // Estamos indicando que nos da igual la clase, que lo que queremos es que cumpla el contrato
  // indicado en HttpAdapter, esto es, que implemente el método get
  constructor(public readonly id: number, public name: string, private readonly http: HttpAdapter) {}

  scream() {
    console.log(`${this.name.toUpperCase()}!!!`);
  }

  speak() {
    console.log(`${this.name}, ${this.name}`);
  }

  async getMoves(): Promise<Move[]> {
    // Con genérico PokeapiResponse
    // Indicamos que la respuesta que vamos a obtener en data es del tipo de dato PokeapiResponse
    const data = await this.http.get<PokeapiResponse>(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
    console.log(data.name, ' - ', data.moves[0].move.name);

    return data.moves;
  }
}

const pokeApiAxios = new PokeApiAdapter();
const pokeApiFetch = new PokeApiFetchAdapter();

// Si funciona Liskov, aquí puedo llamar tanto con PokeApiAdapter como con PokeApiFetchAdapter
export const charmander = new Pokemon(4, 'Charmander', pokeApiFetch);
charmander.getMoves();

export const pikachu = new Pokemon(25, 'Pikachu', pokeApiAxios);
pikachu.getMoves();
