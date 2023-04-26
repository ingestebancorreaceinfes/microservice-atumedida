import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateStudentTestDto } from './dto/create-student_test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentTest } from './entities/student_test.entity';
import { Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { JwtService } from '@nestjs/jwt';
import { GlobalService } from './utils/global.service';
import { StudentService } from 'src/student/student.service';
 
@Injectable()
export class StudentTestService {

  constructor(
    @InjectRepository(StudentTest) private readonly studentTestRepository: Repository<StudentTest>,
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService
  ){}

  async saveStudentTest(token: string, createStudentTestDto: CreateStudentTestDto) {
    type Payload = {
      uuid: string,
      username: string,
      name: string
    }
  
    const data = this.jwtService.decode(token);
    const { uuid } = data as Payload;

    if(this.studentService.checkIfValidUUID(uuid)){
      const studentID = await this.studentService.findStudentByUUID(uuid);
    
      const newStudentTest = this.studentTestRepository.create(createStudentTestDto);

      newStudentTest.student_id = studentID.toString();
      newStudentTest.responses = JSON.stringify(newStudentTest.responses);
      GlobalService.responses = newStudentTest.responses;//Global variable 
      this.studentTestRepository.save(newStudentTest);
      return HttpStatus.CREATED;
    }else{
      const logger = new Logger('TestService');
      logger.error('uuid does not a valid UUID');
      throw new BadRequestException(ErrorMessages.BAD_REQUEST);
    }
  }

}