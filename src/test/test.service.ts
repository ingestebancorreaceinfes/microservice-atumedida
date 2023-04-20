import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from './entities/test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';

@Injectable()
export class TestService {
 
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Test) private readonly testRepository: Repository<Test>
  ){}

  async findStudentTest(token: string) {
    try{
      type Payload = {
        uuid: string
      }
  
      const data = this.jwtService.decode(token);
      const { uuid } = data as Payload;
      console.log(uuid);
      const testsStudent = await this.testRepository
      .query(`SELECT * 
      FROM tests t 
      INNER JOIN vw_tests_applications_actives vtaa ON vtaa.test_id = t.id 
      LEFT JOIN students_tests st ON t.id = st.test_id AND st.student_id = '${uuid}';`);
      return testsStudent;
    }catch(error){
      const logger = new Logger('TestService');
      logger.error(error);
      throw new InternalServerErrorException(ErrorMessages.APPLICATION_ERROR);
    }
  }

}