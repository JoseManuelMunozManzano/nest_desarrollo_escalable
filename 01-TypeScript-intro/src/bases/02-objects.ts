export const pokemonIds = [1, 20, 30, 34, 66];

// Conversión rápida de string a number
// Otra forma sería usando Number('1')
pokemonIds.push(+'1');

console.log(pokemonIds);

// Creando interfaces
interface Pokemon {
  id: number;
  name: string;
  age?: number; // opcional con ?
}

// Objetos literales
export const bulbasaur: Pokemon = {
  id: 1,
  name: 'Bulbasaur',
  age: 2,
};

console.log(bulbasaur);

// Las interfaces no se pueden instanciar
//const charmander = new Pokemon();

export const charmander: Pokemon = {
  id: 4,
  name: 'Charmander',
  age: 1,
};

// Tipos en arreglos
export const pokemons: Pokemon[] = [];

pokemons.push(charmander, bulbasaur);

console.log(pokemons);
