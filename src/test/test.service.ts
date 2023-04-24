import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from './entities/test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { Student } from 'src/student/entities';

@Injectable()
export class TestService {
 
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Test) private readonly testRepository: Repository<Test>,
    @InjectRepository(Student) private readonly studentRepository:Repository<Student>,
  ){}

  async findStudentTest(token: string) {
    type Payload = {
      uuid: string
    }

    const data = this.jwtService.decode(token);
    const { uuid } = data as Payload;

    if(this.checkIfValidUUID(uuid)){
      const studentID = await this.findStudentByUUID(uuid);
      const query = `
        SELECT vtaa.id as test_application_id,vtaa.test_id, vtaa.test_name, vtaa.test_numberofquestions, 
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
        LEFT JOIN students_tests st ON vtaa.test_id = st.test_id AND st.student_id = '${studentID}';`;

        const testsStudent = await this.testRepository.query(query);
        return testsStudent;
    }else{
      const logger = new Logger('TestService');
      logger.error('uuid does not a valid UUID');
      throw new BadRequestException(ErrorMessages.BAD_REQUEST);
    }
  }

  checkIfValidUUID(str: string) {
    // Regular expression to check if string is a valid UUID
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  
    return regexExp.test(str);
  }

  async findStudentByUUID(uuid:string){
    const { id } = await this.studentRepository.findOne({ where: { user_uuid: uuid } });
    if(!id) throw new BadRequestException('Not found student');
    return id;
  }

}