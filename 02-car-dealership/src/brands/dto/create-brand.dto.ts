// La información que espero recibir cuando me mandan el POST.
import { IsString, MinLength } from 'class-validator';

// En este caso solo esperamos el name.
export class CreateBrandDto {
  @IsString()
  @MinLength(1)
  name: string;
}
