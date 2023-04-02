// Queremos obligar a que nos envíen la data de cierta manera (para el POST y el PATCH sobre todo).
// Inicialmente lo hacemos con esta interface, pero vamos a acabar haciendo una clase.
export interface Car {
  id: string;
  brand: string;
  model: string;
}
