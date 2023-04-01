// Decorador de método - @Deprecated

// El objetivo es indicar que un método está obsoleto sin tener que tocar cada método, solo añadir
// este decorador

const Deprecated = (deprecationReason: string) => {
  return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
    // console.log({target})
    return {
      get() {
        const wrapperFn = (...args: any[]) => {
          console.warn(`Method ${memberName} is deprecated with reason: ${deprecationReason}`);
          //! Llamar la función propiamente con sus argumentos
          propertyDescriptor.value.apply(this, args);
        };
        return wrapperFn;
      },
    };
  };
};

export class Pokemon {
  constructor(public readonly id: number, public name: string) {}

  scream() {
    console.log(`${this.name.toUpperCase()}!!`);
  }

  // Aquí indicamos que este método ya no se debería de usar
  // y qué hacer
  @Deprecated('Must use speak2 method instead')
  speak() {
    console.log(`${this.name}, ${this.name}!`);
  }

  speak2() {
    console.log(`${this.name}, ${this.name}!!!!!!`);
  }
}

export const charmander = new Pokemon(4, 'Charmander');
// Si usamos el método con el decorador @Deprecated se indica el warn en la consola
charmander.speak();
