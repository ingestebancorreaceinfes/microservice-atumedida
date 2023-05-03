import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { StudentTestService } from './student_test.service';
import { CreateStudentTestDto } from './dto/create-student_test.dto';
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { StudentTestSchema } from './schema/student-test.schema';
import { Headers } from '@nestjs/common';
import { AuthnGuard } from 'src/auth/guards/auth.guard';
import { SuccessMessages } from 'src/common/enum/success-messages.enum';

@ApiTags('StudentTest')
@Controller()
export class StudentTestController {
  constructor(private readonly studentTestService: StudentTestService) {}

  @ApiResponse({status:201, description: SuccessMessages.REGISTER_SUCCESS_STUDENT_TEST, schema:{type:'object',example:StudentTestSchema}})
  @ApiBadRequestResponse({ status: 400, description: ErrorMessages.BAD_REQUEST })
  @ApiResponse({ status: 401, description: ErrorMessages.NOT_VALID_TOKEN })
  @ApiResponse({ status: 403, description: ErrorMessages.FORBIDDEN })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @ApiHeader({name: 'Authorization',description: 'Generated token by authentication microservice',required: true})
  @UseGuards(AuthnGuard) 
  @Post('student-test')
  saveStudentTest(@Headers('Authorization') request: any,@Body() data: CreateStudentTestDto) {
    const jwt = request.replace('Bearer ', '');
    return this.studentTestService.saveStudentTest(jwt,data);
  }

  @ApiOkResponse({ description: SuccessMessages.OK_RESPONSE })
  @ApiResponse({ status: 401, description: ErrorMessages.NOT_VALID_TOKEN })
  @ApiResponse({ status: 403, description: ErrorMessages.FORBIDDEN })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @ApiHeader({name: 'Authorization',description: 'Generated token by authentication microservice',required: true})
  @UseGuards(AuthnGuard) 
  @Get('student/:id/test/results')
  testResults(@Param('id') id: string, @Headers('Authorization') request: any) {
    const jwt = request.replace('Bearer ', '');
    return this.studentTestService.testResults(jwt,id);
  }

}
