import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorHandleService {
  private readonly logger: Logger;

  constructor(private serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  public errorHandle(error: any) {
    if (error.code === '23505') {
      this.logger.error(`${error} - ${error.detail}`);
      throw new BadRequestException(error.detail);
    }

    // Usando el logger. Se ve en consola de Nest
    this.logger.error(`${error} - ${error.detail}`);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
