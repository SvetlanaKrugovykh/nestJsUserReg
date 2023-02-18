import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user; // assuming user object is added to the request object by Passport

    if (user === 'admin') {
      // allow access to admin routes/actions
      next();
    } else if (user === 'user') {
      // allow access to user routes/actions
      next();
    } else {
      // deny access to guest routes/actions
      res.status(403).send('Access Denied');
    }
  }
}