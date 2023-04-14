import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './entities';
import { CreateStudentDto } from './dto/create-student.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  //Obtiene los tipos de documento {crea el nombre de la función extrayendo la escencia del comentario}
  //Use noun to the endpoints, separate words with Hyphens (Guiones)
  @Get('document-types')
  getDocumentTypes() {
    return this.studentService.getDocumentTypes();
  }

  @Get('departaments')
  getDepartaments() {
    return this.studentService.getDepartaments();
  }

  // @Get('departament/:id')
  // getDepartamentById(@Param('id') id : string ) {
  //   return this.studentService.getDepartamentById(id);
  // }

  @Get('cities')
  getCities() {
    return this.studentService.getCities();
  }

  @Get('grades')
  getGrades() {
    return this.studentService.getGrades();
  }

  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @Post('')
  studentRegister(@Body() data: CreateStudentDto) {
    return this.studentService.studentRegister(data);
  }

}