import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

@ApiTags('Student')
@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  //Obtiene los tipos de documento {crea el nombre de la función extrayendo la escencia del comentario}
  //Use noun to the endpoints, separate words with Hyphens (Guiones)
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @Get('document-types')
  getDocumentTypes() {
    return this.studentService.getDocumentTypes();
  }

  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @Get('states')
  getStates() {
    return this.studentService.getStates();
  }

  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @Get('cities')
  getCities() {
    return this.studentService.getCities();
  }

  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @Get('state/:id/cities')
  getStateById(@Param('id') id : string ) {
    return this.studentService.getStateById(id);
  }

  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @Get('grades')
  getGrades() {
    return this.studentService.getGrades();
  }

  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('student')
  studentRegister(@Body() data: CreateStudentDto) {
    return this.studentService.studentRegister(data);
  }

}