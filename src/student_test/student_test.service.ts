import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStudentTestDto } from './dto/create-student_test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentTest } from './entities/student_test.entity';
import { Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { StudentService } from 'src/student/student.service';
import { StudentTestModule } from './student_test.module';
import { SuccessMessages } from 'src/common/enum/success-messages.enum';
import { TestApplicationService } from 'src/test_application/test_application.service';
import { TestDetailService } from 'src/test_detail/test_detail.service';
 
@Injectable()
export class StudentTestService {

  constructor(
    @InjectRepository(StudentTest) private readonly studentTestRepository: Repository<StudentTest>,
    private readonly studentService: StudentService,
    private readonly testApplicationService: TestApplicationService,
    private readonly testDetailService: TestDetailService
  ){}

  async saveStudentTest(token: string, createStudentTestDto: CreateStudentTestDto) {
      const studentId = await this.studentService.getStudentId(token);
      const studentHasTestApplied = await this.findStudentTest(studentId.toString(),createStudentTestDto.test_id);
      
      if(!studentHasTestApplied){
        const newStudentTest = this.studentTestRepository.create(createStudentTestDto);
        newStudentTest.student_id = studentId.toString();
        StudentTestModule.globalResponses = newStudentTest.responses;//2. Utilizar variable global en el servicio
        newStudentTest.responses = JSON.stringify(newStudentTest.responses);
        // this.studentTestRepository.save(newStudentTest);
        this.calculateTestScore(newStudentTest.test_id,newStudentTest.student_id);
        const response = {
          "status-code": 201,
          "state": "realizada",
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

  async calculateTestScore(testId: string, studentId:string){
    const typeTestScore = await this.testApplicationService.findTypeScore(testId);
    
    switch(typeTestScore){
        case 1:
            const correctAnswers = await this.testDetailService.findQuestionAnswers(testId);
            const selectedAnswers = StudentTestModule.globalResponses;

            let goodAnswers = 0;

            for (let i = 0; i < correctAnswers.length; i++) {
                if (correctAnswers[i].answer === selectedAnswers[i].option) {
                  goodAnswers += 1; 
                }
            }
            console.log(goodAnswers);
            this.saveTotalScore(testId, studentId.toString(), goodAnswers);
            break;
        case 2:
            break;
        default:
            break;
    }
  }

  async saveTotalScore(testId: string, studentId: string, totalScore: number ){
    console.log('testId',testId);
    console.log('studentId',studentId);
    console.log('totalScore',totalScore);
    const updateTotalScore = await this.studentTestRepository
    .createQueryBuilder()
    .update(StudentTest)
    .set({ total_score: totalScore })
    .where( "student_id = :studentId", { studentId } ) 
    .andWhere("test_id = :testId", { testId })
    .execute();

    console.log(updateTotalScore);
    return updateTotalScore;


  }

}