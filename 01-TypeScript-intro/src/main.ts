import { name, age } from './bases/01-types';
import { pokemonIds, bulbasaur } from './bases/02-objects';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>01-types</h1>
    <h2>Hello ${name}, ${age}!</h2>
    <h1>02-objects</h1>
    <h2>Hello ${pokemonIds.join(', ')}</h2>
    <h2>${bulbasaur.name}</h2>
  </div>
`;
