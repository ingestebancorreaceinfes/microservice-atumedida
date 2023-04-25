import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateStudentTestDto } from './dto/create-student_test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentTest } from './entities/student_test.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/student/entities';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StudentTestService {

  constructor(
    @InjectRepository(StudentTest) private readonly studentTestRepository: Repository<StudentTest>,
    @InjectRepository(Student) private readonly studentRepository:Repository<Student>,
    private readonly jwtService: JwtService
  ){}

  async saveStudentTest(token: string, createStudentTestDto: CreateStudentTestDto) {
    try{
      type Payload = {
        uuid: string,
        username: string,
        name: string
      }
    
      const data = this.jwtService.decode(token);
      const { uuid } = data as Payload;
  
      if(this.checkIfValidUUID(uuid)){
        const studentID = await this.findStudentByUUID(uuid);
      
        const newStudentTest = this.studentTestRepository.create(createStudentTestDto);
        console.log();
        newStudentTest.student_id = studentID.toString();
        newStudentTest.responses = JSON.stringify(newStudentTest.responses);
        this.studentTestRepository.save(newStudentTest);
        return HttpStatus.CREATED;
      }else{
        const logger = new Logger('TestService');
        logger.error('uuid does not a valid UUID');
        throw new BadRequestException(ErrorMessages.BAD_REQUEST);
      }
    }catch(error){
      const logger = new Logger("StudentTest");
      logger.error(error);
      throw new InternalServerErrorException(ErrorMessages.APPLICATION_ERROR);
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