import { CanActivate, ExecutionContext,Injectable,Logger,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ErrorMessages } from '../../common/enum/error-messages.enum';
  
@Injectable()
export class AuthnGuard implements CanActivate {
  constructor(
      private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        console.log(token);
        throw new UnauthorizedException(ErrorMessages.NOT_VALID_TOKEN);
      }

      try{
        const payload = await this.jwtService.verify(
            token,
            {
              secret: process.env.JWT_SECRET
            }
        );

        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
        return true;
      }catch(error){
        const logger = new Logger("AuthGuard");
        logger.error(error);
      }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];//split divide un objeto en un array
    return type === 'Bearer' ? token : undefined;
  }

}