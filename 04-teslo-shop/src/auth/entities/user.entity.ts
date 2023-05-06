// Recordar que el objetivo de las entidades es tener una relación entre las tablas de nuestra Base de Datos
// y nuestra aplicación.
//
// Este fichero se ha renombrado a user.entity.ts (se llamaba auth.entity.ts)
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  // select es para indicar si la columna se selecciona en un QueryBuilder y operaciones find.
  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  fullName: string;

  // No se van a eliminar usuarios físicamente de la BD.
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];
}
