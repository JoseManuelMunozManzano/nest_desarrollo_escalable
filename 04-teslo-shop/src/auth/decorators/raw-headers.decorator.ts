// Este decorador es muy genérico y debería estar en el módulo common.
// Para fines educativos, tenerlo todo agrupado, lo vamos a dejar en el módulo auth.
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const header = req.rawHeaders;

    return header;
  },
);
