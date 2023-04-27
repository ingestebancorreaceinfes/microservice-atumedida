import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TestDetailService } from './test_detail.service';
import { ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { AuthnGuard } from 'src/auth/guards/auth.guard';
import { Headers } from '@nestjs/common';
import { SuccessMessages } from 'src/common/enum/success-messages.enum';

@ApiTags('Test Details')
@Controller('')
export class TestDetailController {
  constructor(private readonly testDetailService: TestDetailService) {}

  @ApiOkResponse({ description: SuccessMessages.REGISTER_SUCCESS_STUDENT_TEST })
  @ApiResponse({ status: 401, description: ErrorMessages.NOT_VALID_TOKEN })
  @ApiResponse({ status: 403, description: ErrorMessages.FORBIDDEN })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @ApiHeader({name: 'Authorization',description: 'Generated token by authentication microservice',required: true})
  // @UseGuards(AuthnGuard) 
  @Get('test/:id/score')
  testScore(@Headers('Authorization') request: any, @Param('id') id: string){
    const jwt = request.replace('Bearer ', '');
    this.testDetailService.testScore(jwt,id);
  }

}