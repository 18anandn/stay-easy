import { NextFunction, Request, Response } from 'express';

export function delayer(duration: number) {
  return async function (req: Request, res: Response, next: NextFunction) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Delayed by ${duration / 1000}s`);
      }, duration);
    });
    next();
  };
}
