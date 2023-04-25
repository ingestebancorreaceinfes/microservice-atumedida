import { Controller, Get, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { Headers } from '@nestjs/common';
import { AuthnGuard } from 'src/auth/guards/auth.guard';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';

@ApiTags('Test')
@Controller('')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @ApiResponse({ status: 200, description: ErrorMessages.OK_RESPONSE })
  @ApiResponse({ status: 400, description: ErrorMessages.BAD_REQUEST })
  @ApiResponse({ status: 401, description: ErrorMessages.NOT_VALID_TOKEN })
  @ApiResponse({ status: 403, description: ErrorMessages.FORBIDDEN })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @ApiHeader({name: 'Authorization',description: 'Generated token by authentication microservice',required: true})
  @UseGuards(AuthnGuard)
  @Get('student/test')
  findStudentTest(@Headers('Authorization') request: any ) {
    const jwt = request.replace('Bearer ', '');
    return this.testService.findStudentTest(jwt);
  }

}