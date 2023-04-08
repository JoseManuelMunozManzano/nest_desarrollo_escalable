// Lo que necesito que tenga que implementar una clase de tipo HttpAdapter para que pue pueda usarse en cualquier
// otro servicio.
export interface HttpAdapter {
  get<T>(url: string): Promise<T>;
}
