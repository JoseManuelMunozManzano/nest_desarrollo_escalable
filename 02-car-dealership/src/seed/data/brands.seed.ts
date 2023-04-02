// Las interfaces y las entities, clases que no tengan ninguna dependencia, se pueden importar aquí
// aunque no sean parte del módulo.
// Las clases con dependencias deben importarse en su fuente módule.ts correspondiente.
import { v4 as uuid } from 'uuid';
import { Brand } from 'src/brands/entities/brand.entity';

export const BRANDS_SEED: Brand[] = [
  {
    id: uuid(),
    name: 'volvo',
    createdAt: new Date().getTime(),
  },
  {
    id: uuid(),
    name: 'toyota',
    createdAt: new Date().getTime(),
  },
  {
    id: uuid(),
    name: 'honda',
    createdAt: new Date().getTime(),
  },
  {
    id: uuid(),
    name: 'jeep',
    createdAt: new Date().getTime(),
  },
  {
    id: uuid(),
    name: 'tesla',
    createdAt: new Date().getTime(),
  },
];
