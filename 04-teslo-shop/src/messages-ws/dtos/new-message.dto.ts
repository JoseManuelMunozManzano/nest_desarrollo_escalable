import { IsString, MinLength } from 'class-validator';

// Como quiero que se reciba la información del lado del cliente
export class NewMessageDto {
  @IsString()
  @MinLength(1)
  message: string;
}
