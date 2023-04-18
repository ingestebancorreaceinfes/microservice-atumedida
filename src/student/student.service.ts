import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { States, Cities, Student } from './entities/index';
import { Repository } from 'typeorm';
import { documentTypes, grades } from './data/index';
import { CreateStudentDto } from './dto/create-student.dto';
import { JwtService } from '@nestjs/jwt';

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
            uuid: string
        }
        const data = this.jwtService.decode(token);

        const { uuid } = data as Payload;
        
        const isRegister = await this.findStudentByUUID(uuid);

        if(!isRegister) {
            const newStudent = this.studentRepository.create(createStudentDto);//crea una instancia de la entidad y copia todos las propiedades en un objeto 
            newStudent.user_uuid = uuid;
            return await this.studentRepository.save(newStudent);
        }else{  
            throw new BadRequestException();
        }
    }

    async findStudentByUUID(user_uuid: string) {
        const student = await this.studentRepository.findOne( { where: {user_uuid}} );
        return student;
    }

}