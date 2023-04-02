// Este Entity es similar a cars/interfaces/car.interface.ts
// El entity sería la representación de una tabla llamada brands (en plural), una abstracción de
// como acabaríamos insertando la data en BD.
export class Brand {
  id: string;
  name: string;

  createdAt: number;
  updatedAt?: number;
}
