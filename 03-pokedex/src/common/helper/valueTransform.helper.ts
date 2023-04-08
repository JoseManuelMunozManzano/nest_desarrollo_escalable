// Con este helper transformamos un string a number y lo podremos usar directamente en los DTO.
export function toNumber(value: string): number {
  const newValue: number = +value;

  return newValue;
}
