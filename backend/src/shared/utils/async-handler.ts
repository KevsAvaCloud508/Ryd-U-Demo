import type { NextFunction, Request, Response } from 'express';

type AsyncHandler<Req extends Request = Request> = (req: Req, res: Response, next: NextFunction) => Promise<void>;

// Express 4 no reenvía automáticamente los rechazos de promesas al manejador de
// errores; este wrapper captura el error y lo pasa a `next` para que llegue ahí.
export function asyncHandler<Req extends Request = Request>(handler: AsyncHandler<Req>) {
  return (req: Req, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}
