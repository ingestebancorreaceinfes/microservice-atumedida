import { Controller, Get } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  //Obtiene los tipos de documento {crea el nombre de la función extrayendo la escencia del comentario}
  //Use noun to the endpoints, separate words with Hyphens (Guiones)
  @Get('document-types')
  getDocumentTypes(): string {
    return this.studentService.getDocumentTypes();
  }

  @Get('departaments')
  getDepartaments() {
    return this.studentService.getDepartaments();
  }

  @Get('cities')
  getCities() {
    return this.studentService.getCities();
  }

  @Get('grades')
  getGrades(): string {
    return this.studentService.getGrades();
  }

}