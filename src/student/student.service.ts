import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { States, Cities, Student } from './entities/index';
import { Repository } from 'typeorm';
import { documentTypes, grades } from './data/index';
import { CreateStudentDto } from './dto/create-student.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';

@Injectable()
export class StudentService {
    
    constructor(
        @InjectRepository(States) private readonly statesRepository:Repository<States>,
        @InjectRepository(Cities) private readonly citiesRepository:Repository<Cities>,
        @InjectRepository(Student) private readonly studentRepository:Repository<Student>,
        private readonly jwtService: JwtService
    ){}
    
    getDocumentTypes(): string {
        return JSON.stringify(documentTypes);//Convierte un Object JS a JSON
    }
    
    getStates(): Promise<States[]> {
        return this.statesRepository.find();
    }

    getCities(): Promise<Cities[]> {
        return this.citiesRepository.find();
    }

    async getStateById(id: string) {
        try {
            return await this.citiesRepository
            .createQueryBuilder('cities')
            .select('cities.id, cities.name')
            .leftJoin(
                "cities.state",
                "state",
            )
            .where("state_id = :id", { id })
            .execute();
        }catch(error){
            const logger = new Logger("StudentServcie");
            logger.log(error);
        }
    }
    
    getGrades(): string {
        return JSON.stringify(grades);
    }

    
    async studentRegister(token: string, createStudentDto: CreateStudentDto) {

        type Payload = {
            uuid: string,
            username: string,
            name: string
        }
        const data = this.jwtService.decode(token);
        const { uuid, username, name } = data as Payload;
        
        const isRegister = await this.findStudentByUUID(uuid);

        if(!isRegister) {
            const newStudent = this.studentRepository.create(createStudentDto);//crea una instancia de la entidad y copia todos las propiedades en un objeto 
            newStudent.user_uuid = uuid;
            newStudent.email = username;
            const arrayFullName = name.split(" ", 3);
            newStudent.name = arrayFullName[0];
            newStudent.lastname = arrayFullName[1]+" "+arrayFullName[2];
            this.studentRepository.save(newStudent);
            return HttpStatus.CREATED;
        }else{  
            throw new BadRequestException(ErrorMessages.BAD_REQUEST);
        }
    }

    async findStudentByUUID(user_uuid: string) {
        const student = await this.studentRepository.findOne( { where: {user_uuid}} );
        return student;
    }
}