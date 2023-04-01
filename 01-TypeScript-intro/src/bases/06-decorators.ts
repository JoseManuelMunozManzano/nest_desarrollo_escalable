// Los decoradores son funciones que se usan indicando @NombreDecorador()
// Se les puede pasar parámetros y usualmente regresan una función o una modificación.
// El target realmente es una clase pero se suele ver definida como una función.
// ¿Qué beneficios tiene un decorador de clase? El decorador tiene acceso a la definición de la clase
// a través del parámetro target, y la puede extender, añadiendo funcionalidades, bloquear funcionalidades,
// remover funcionalidades, sobreescribir por completo la clase o crear una nueva basada en ella...
//
// Nest lo usa muchísimo para transformar datos, para definir que una clase es un módulo o un controlador...

class NewPokemon {
  constructor(public readonly id: number, public name: string) {}

  scream() {
    console.log('NO QUIERO!!');
  }

  speak() {
    console.log('no quiero hablar!!');
  }
}

const MyDecorator = () => {
  return (target: Function) => {
    console.log(target);

    // Se regresa la definición de NewPokemon (no una nueva instancia, la definición)
    // Es decir, estamos sobreescribiendo la clase.
    // Ahora, cuando se haga una nueva instancia de Pokemon, de forma indirecta se está trabajando
    // con NewPokemon
    return NewPokemon;
  };
};

// Para que no salga error en @MyDecorator(), en tsconfig.json añadir:
//    "experimentalDecorators": true,
@MyDecorator()
export class Pokemon {
  constructor(public readonly id: number, public name: string) {}

  scream() {
    console.log(`${this.name.toUpperCase()}!!`);
  }

  speak() {
    console.log(`${this.name}, ${this.name}!`);
  }
}

export const charmander = new Pokemon(4, 'Charmander');

charmander.scream();
charmander.speak();
