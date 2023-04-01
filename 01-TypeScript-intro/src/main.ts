import { name, age } from './bases/01-types';
import { pokemonIds, bulbasaur, pokemons } from './bases/02-objects';
import { charmander, meow } from './bases/03-classes';
import { charmander as charmander2 } from './bases/04-metodos-asincronos';
import { charmander as charmander3, pikachu } from './bases/05-inyection';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>01-types</h1>
    <h2>Hello ${name}, ${age}!</h2>
    <h1>02-objects</h1>
    <h2>Hello ${pokemonIds.join(', ')}</h2>
    <h2>${bulbasaur.name}</h2>
    <h2>${pokemons.join(', ')}</h2>
    <h1>03-classes</h1>
    <h2>${charmander.name}</h2>
    <h2>${meow.name}</h2>
    <h1>04-metodos-asincronos</h1>
    <h2>${charmander2.getMoves()}</h2>
    <h1>05-inyection</h1>
    <h2>${charmander3.name} ${charmander3.id}</h2>
    <h2>${pikachu.name} ${pikachu.id}</h2>
  </div>
`;
