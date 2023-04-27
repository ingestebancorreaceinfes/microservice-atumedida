import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentTestDto } from './dto/create-student_test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentTest } from './entities/student_test.entity';
import { Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { StudentService } from 'src/student/student.service';
import { StudentTestModule } from './student_test.module';
import { SuccessMessages } from 'src/common/enum/success-messages.enum';
 
@Injectable()
export class StudentTestService {

  constructor(
    @InjectRepository(StudentTest) private readonly studentTestRepository: Repository<StudentTest>,
    private readonly studentService: StudentService,
  ){}

  async saveStudentTest(token: string, createStudentTestDto: CreateStudentTestDto) {
      const studentId = await this.studentService.getStudentId(token);
      const studentHasTestApplied = await this.findStudentTest(studentId.toString(),createStudentTestDto.test_id);
      
      if(!studentHasTestApplied){
        const newStudentTest = this.studentTestRepository.create(createStudentTestDto);
        newStudentTest.student_id = studentId.toString();
        newStudentTest.responses = JSON.stringify(newStudentTest.responses);
        this.studentTestRepository.save(newStudentTest);
        const response = {
          "status": 201,
          "message": SuccessMessages.REGISTER_SUCCESS_STUDENT_TEST
        }
        return JSON.stringify(response);
      }else{
        throw new ConflictException(ErrorMessages.CONFLICT_RESPONSE_TEST_APPLICATION);
      }      
  }

  async findStudentTest(student_id: string, test_id: string){
    const studentTest = await this.studentTestRepository.findOne({ where: { student_id, test_id } });
    return studentTest;
  }

  async findStudentResponses(studentId: string) {
    const { responses } = await this.studentTestRepository.findOne({ where: { student_id: studentId } });
    if(!responses) throw new NotFoundException('Not found responses');
    StudentTestModule.globalResponses = responses;
    return StudentTestModule.globalResponses;//2. Utilizar variable global en el servicio
  }

}