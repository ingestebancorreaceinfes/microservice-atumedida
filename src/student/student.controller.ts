import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentSchema } from './schema/student.shema';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { Headers } from '@nestjs/common';
import { AuthnGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Student')
@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  //Obtiene los tipos de documento {crea el nombre de la función extrayendo la escencia del comentario}
  //Use noun to the endpoints, separate words with Hyphens (Guiones)
  @ApiOkResponse({ description: ErrorMessages.OK_RESPONSE })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @Get('document-types')
  getDocumentTypes() {
    return this.studentService.getDocumentTypes();
  }

  @ApiOkResponse({ description: ErrorMessages.OK_RESPONSE })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @Get('states')
  getStates() {
    return this.studentService.getStates();
  }

  @ApiOkResponse({ description: ErrorMessages.OK_RESPONSE })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @Get('cities')
  getCities() {
    return this.studentService.getCities();
  }

  @ApiOkResponse({ description: ErrorMessages.OK_RESPONSE })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @Get('state/:id/cities')
  getStateById(@Param('id') id : string ) {
    return this.studentService.getStateById(id);
  }

  @ApiOkResponse({ description: ErrorMessages.OK_RESPONSE })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @Get('grades')
  getGrades() {
    return this.studentService.getGrades();
  }

  @ApiResponse({status:201, description: ErrorMessages.CREATED, schema:{type:'object',example:StudentSchema}})
  @ApiBadRequestResponse({ description: ErrorMessages.BAD_REQUEST })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @ApiHeader({name: 'Authorization',description: 'Generated token by authentication microservice',required: true})
  @UseGuards(AuthnGuard) //Validar el token
  @Post('student')
  studentRegister(@Headers('Authorization') request: any,  @Body() data: CreateStudentDto) {
    const jwt = request.replace('Bearer ', '');
    return this.studentService.studentRegister(jwt, data);
  }

}