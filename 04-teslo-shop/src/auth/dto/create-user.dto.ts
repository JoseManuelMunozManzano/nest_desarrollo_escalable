import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// Recordar que los dto serían una representación de lo que espero que me envíen en el body del request.
export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    nullable: false,
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    nullable: false,
    minLength: 6,
    maxLength: 50,
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  // El password debe cumplir esta expresión regular.
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'User fullname',
    nullable: false,
    minLength: 1,
    required: true,
  })
  @IsString()
  @MinLength(1)
  fullName: string;
}
