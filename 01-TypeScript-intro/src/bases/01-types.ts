// Cuando se hace un export, Vite hace automáticamente la configuración de módulos, por lo que, en este caso,
// ya se podrá usar la constante name en cualquier otro archivo.
// Veremos que esta característica también la tiene Nest.
export let name = 'José Manuel';
export const age: number = 44;
export const isValid: boolean = true;

// Hay que tratar hasta donde sea posible que en los módulo (esto es un módulo) NO se coloque código que se ejecute cuando el archivo
// es leido la primera vez, es decir, al hacer el import en el fichero main.ts, salvo que sea exactamente lo que queremos hacer.
// Vamos, que NO habría que hacer todas las sentencias que vienen abajo.
//
// Solo exportaciones de definiciones y funciones
console.log(isValid);

// Type Safety
// TypeScript se encarga de asegurarse que el tipo de dato es el que estoy esperando.
//name = 3; daría error porque name es un string
name = 'Adriana';

export const templateString = ` Esto es un string
multilinea
que puede tener
" dobles
' simple
inyectar valores: ${name}
expresiones: ${1 + 1}
números: ${age}
booleanos: ${isValid}
`;

console.log(templateString);
