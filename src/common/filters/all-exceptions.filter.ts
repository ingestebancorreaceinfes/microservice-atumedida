
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorMessages } from '../enum/error-messages.enum';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: any, host: ArgumentsHost): void {
      // In certain situations `httpAdapter` might not be available in the
      // constructor method, thus we should resolve it here.
      const { httpAdapter } = this.httpAdapterHost;
  
      const ctx = host.switchToHttp();
  
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
 
      let requestException = {}
      let httpMessage = ErrorMessages.APPLICATION_ERROR

      if(exception instanceof HttpException){
          const reqException = exception.getResponse();
          requestException = reqException["message"];
          httpMessage = reqException["error"];
      }
      
      //Consumir servicio para registrar el error en base de datos.

      const responseBody = {
        statusCode: httpStatus,
        //timestamp: new Date().toISOString(),
        //path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: requestException,
        error:httpMessage
        //method:ctx.getRequest().method
      };
  
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
  }
  