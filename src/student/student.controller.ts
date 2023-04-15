import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  //Obtiene los tipos de documento {crea el nombre de la función extrayendo la escencia del comentario}
  //Use noun to the endpoints, separate words with Hyphens (Guiones)
  @Get('document-types')
  getDocumentTypes() {
    return this.studentService.getDocumentTypes();
  }

  @Get('states')
  getStates() {
    return this.studentService.getStates();
  }

  @Get('cities')
  getCities() {
    return this.studentService.getCities();
  }

  @Get('state/:id/cities')
  getStateById(@Param('id') id : string ) {
    return this.studentService.getStateById(id);
  }

  @Get('grades')
  getGrades() {
    return this.studentService.getGrades();
  }

  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @Post('student')
  studentRegister(@Body() data: CreateStudentDto) {
    return this.studentService.studentRegister(data);
  }

}