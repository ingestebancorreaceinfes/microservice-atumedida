import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from './entities/test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class TestService {
 
  constructor(
    @InjectRepository(Test) private readonly testRepository: Repository<Test>,
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService
  ){}

  async findStudentTest(token: string) {
    try{
      type Payload = {
        uuid: string
      }
  
      const data = this.jwtService.decode(token);
      const { uuid } = data as Payload;
      console.log('uuid',uuid);
  
      if(this.studentService.checkIfValidUUID(uuid)){
        const studentID = await this.studentService.findStudentByUUID(uuid);
        const query = `
          SELECT vtaa.id as test_application_id,vtaa.test_id, vtaa.test_name, vtaa.test_numberofquestions, vtaa.uri_image,
          case
            when st.started_at is null then vtaa.start_at else st.started_at 
            end as started_at, 
          case
            when st.ended_at is null then vtaa.end_at else st.ended_at  
            end as ended_at,
          case
            when st.started_at is null then 'pendiente' else 'realizada' 
            end as state, st.total_score 
          FROM vw_tests_applications_actives vtaa
          LEFT JOIN students_tests st ON vtaa.test_id = st.test_id AND st.student_id = '${studentID}'
          order by vtaa.created_at desc;`;
  
          const testsStudent = await this.testRepository.query(query);
          return testsStudent;
      }else{
        const logger = new Logger('TestService');
        logger.error('uuid does not a valid UUID');
        throw new BadRequestException(ErrorMessages.BAD_REQUEST);
      }
    }catch(error){
      const logger = new Logger();
      logger.error(error);
    }
  }

}