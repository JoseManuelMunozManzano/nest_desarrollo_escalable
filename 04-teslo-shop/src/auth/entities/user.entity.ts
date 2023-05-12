// Recordar que el objetivo de las entidades es tener una relación entre las tablas de nuestra Base de Datos
// y nuestra aplicación.
//
// Este fichero se ha renombrado a user.entity.ts (se llamaba auth.entity.ts)
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Product } from '../../products/entities';

@Entity('users')
export class User {
  @ApiProperty({
    example: '7497da33-3672-4a0c-b8c9-556817aaa7d9',
    description: 'User Id',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'mymail@mail.com',
    description: 'User Email',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  email: string;

  // select es para indicar si la columna se selecciona en un QueryBuilder y operaciones find.
  @ApiProperty({
    example: 'password',
    description: 'User Password',
  })
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User FullName',
  })
  @Column('text')
  fullName: string;

  // No se van a eliminar usuarios físicamente de la BD.
  @ApiProperty({
    example: 'true',
    description: 'User IsActive',
    default: true,
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: ['admin', 'super', 'user'],
    description: 'User Roles',
    default: ['user'],
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  // Vamos a indicar que usuario creo el producto.
  // Un usuario puede crear muchos productos (One to Many)
  // Un One to Many no crea una nueva columna.
  @OneToMany(
    // Entidad con la que se relaciona
    () => Product,
    // Instancia del producto y como se relaciona con esta tabla.
    (product) => product.user,
  )
  product: Product;

  // Esto sería parecido a triggers en bases de datos. Antes de insertar y de actualizar hazme cosas.
  // Esta medida de seguridad se añade porque se podría dar de alta un email en mayúsculas y luego buscarlo
  // en minúsculas. Ahora lo primero que hace con el email es ponerlo en minúsculas.
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
