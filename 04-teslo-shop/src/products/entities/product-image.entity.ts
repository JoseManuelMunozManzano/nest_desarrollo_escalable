import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  // Autoincremental.
  // Identificador único de las imágenes que se van subiendo.
  @PrimaryGeneratedColumn()
  id: number;

  // Tiene que venir el url y de tipo text
  @Column('text')
  url: string;
}

// Nota: Para crear una relación entre Product y Product_Image nos hace falta una nueva columna en Product_Image
// que nos indique a que id de producto pertenece.
