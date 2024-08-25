import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('LoggingMiddlware!');
    console.time('Req-Res time');
    res.on('finish', () => console.timeEnd('Req-Res time'));

    next();
  }
}
