// Es una clase adaptadora. Se va a adaptar una funcionalidad externa de terceros a mi código.
// Es una buena práctica que el nombre del fuente lo indique --> pokeApi.adapter
// Sirve como puente entre el paquete de terceros con mi código.
// Si algo cambia en el paquete de terceros solo hay que cambiar esta clase.
//
// También se usan genéricos porque la clase adaptadora no debería conocer la implementación de PokeapiResponse
import axios from 'axios';
//import { PokeapiResponse } from '../interfaces/pokeapi-response.interface';

// 4. Resolver Liskov
// Dice como lucen las clases y ocultan la implementación.
// Sin esto y el implements HttpAdapter de las clases de abajo, en 05-inyection.ts no funcionaría este código
// const pokeApiAxios = new PokeApiAdapter();
// const pokeApiFetch = new PokeApiFetchAdapter();
// porque PokeApiAdapter y PokeApiFetchAdapter no son compatibles.
// Pero es que yo solo quiero que se pueda usar get, con los argumentos esperados y la respuesta
// sea la esperada.
export interface HttpAdapter {
  get<T>(url: string): Promise<T>;
}

// 3. Liskov
// Otra implementación de get sin usar axios para aplicar luego Liskov
// Se indica que se implementa HttpAdapter (para resolver Liskov)
export class PokeApiFetchAdapter implements HttpAdapter {
  async get<T>(url: string): Promise<T> {
    const resp = await fetch(url);
    const data: T = await resp.json();

    console.log('con fetch');
    return data;
  }
}

// 1. Clase Adaptadora
// Se indica que se implementa HttpAdapter (para resolver Liskov)
export class PokeApiAdapter implements HttpAdapter {
  // En lugar de usar axios usaremos la propiedad de la clase axios
  // Si el día de mañana es axios2, cambiando el nombre de la propiedad a axios2 saldrán todos los
  // sitios donde tenemos que hacer el cambio
  private readonly axios = axios;

  // 2. Genéricos
  async get<T>(url: string): Promise<T> {
    // La clase adaptadora no debe conocer la implementación PokeapiResponse. De ahí el usar genéricos
    //const { data } = await this.axios.get<PokeapiResponse>(url);
    //
    // Si el día de mañana axios cambia y en vez de get se usa getRequest, solo tengo que cambiarlo aquí
    const { data } = await this.axios.get<T>(url);

    console.log('con axios');
    return data;
  }

  // Quedan como un ejemplo incompleto
  async post(url: string, data: any) {}

  async patch(url: string, data: any) {}

  async delete(url: string) {}
}
