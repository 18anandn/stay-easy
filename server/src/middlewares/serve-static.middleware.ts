import { Injectable, NestMiddleware } from '@nestjs/common';
import express, { NextFunction, Request, Response } from 'express';
import { join } from 'path';

@Injectable()
export class ServeStaticMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Specify the directory to serve static files from
    express.static(join(process.cwd(), 'front-end'))(req, res, next);
  }
}
