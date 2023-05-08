// Recordar que el objetivo de las entidades es tener una relación entre las tablas de nuestra Base de Datos
// y nuestra aplicación.
//
// Este fichero se ha renombrado a user.entity.ts (se llamaba auth.entity.ts)
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  // Esto sería parecido a triggers en bases de datos. Antes de insertar y de actualizar hazme cosas.
  // Esta medida de seguridad se añade porque se podría dar de alta un email en mayúsculas y luego buscarlo
  // en minúsculas. Ahora lo primero que hace con el email es ponerlo en minúsculas.
  // NOTA: Ya no buscamos por email sino por id, pero se mantiene este código por fines educativos.
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
