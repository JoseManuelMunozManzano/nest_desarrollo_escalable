// Hay dos formas de definir clases
// 1. Forma tradicional de definir clases de forma explicita
export class Pokemon {
  public id: number;
  public name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    console.log('constructor llamado');
  }
}

export const charmander = new Pokemon(4, 'Charmander');

// 2. Forma corta y más usual de definir clases
export class PokemonFormaCorta {
  constructor(public id: number, public name: string) {}
}

export const meow = new PokemonFormaCorta(4, 'Meow');

// Usando readonly de TS
// Con readonly no se puede asignar un valor a la propiedad fuera del constructor, ni en la clase.
// JS funciona pero TS se queja. Al hacer la transpilación también fallará.
// readonly se usa en Nest a la hora de hacer la inyección de dependencias.
// También se usan getters y setters, métodos y this
export class PokemonFormaCortaReadonly {
  constructor(public readonly id: number, public name: string) {}

  // Getter
  // Se indica lo que devuelve el getter
  // En JS, en las clases, this apunta a la instancia de la clase que se creó
  get imageUrl(): string {
    return `https://pokemon.com/${this.id}.jpg`;
  }

  // Métodos
  // Public es por defecto y no hace falta ponerlo
  scream() {
    // this.id = 8; // Esto falla porque el id no se puede cambiar (readonly)
    console.log(`${this.name.toUpperCase()}!!!`);
    this.speak();
  }

  private speak() {
    console.log(`${this.name}, ${this.name}`);
  }
}

export const pikachu = new PokemonFormaCortaReadonly(4, 'Pikachu');

// pikachu.id = 7;  // Esto falla porque el id no se puede cambiar (readonly)
console.log(pikachu);
console.log(pikachu.imageUrl); // No hacen falta los paréntesis para obtener el valor de un getter

pikachu.scream();
