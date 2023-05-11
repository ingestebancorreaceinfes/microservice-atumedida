import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { States, Cities, Student } from './entities/index';
import { Repository } from 'typeorm';
import { documentTypes, grades } from './data/index';
import { CreateStudentDto } from './dto/create-student.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { SuccessMessages } from 'src/common/enum/success-messages.enum';

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
        try{
            const data = await this.getUsernameAndUUID(token);
            console.log('data',data);
            const isRegister = await this.findStudentByUUID(data.uuid);
            if(!isRegister) {
                const newStudent = this.studentRepository.create(createStudentDto);//crea una instancia de la entidad y copia todos las propiedades en un objeto 
                newStudent.user_uuid = data.uuid;
                newStudent.email = data.username;
                this.studentRepository.save(newStudent);
                const response = {
                    "status": 201,
                    "message": SuccessMessages.CREATED
                }
                return JSON.stringify(response);
            }else{  
                throw new ConflictException(ErrorMessages.CONFLICT_RESPONSE);
            }
        }catch(error){
            const logger = new Logger();
            logger.error(error);
        }
        
    }

    async getUsernameAndUUID(token: string){
        type Payload = {
            uuid: string,
            username: string
        }

        const data = this.jwtService.decode(token);
        const { uuid, username } = data as Payload;

        if(this.checkIfValidUUID(uuid)){
            const data = {
                uuid, 
                username
            }
            return data;
        }else{
            const logger = new Logger('TestService');
            logger.error('uuid does not a valid UUID');
            throw new BadRequestException(ErrorMessages.BAD_REQUEST);
        }
    }

    async getStudentId(token: string){
        type Payload = {
            uuid: string,
            username: string
        }

        const data = this.jwtService.decode(token);

        const { uuid } = data as Payload;

        if(this.checkIfValidUUID(uuid)){
            const studentID = await this.findStudentByUUID(uuid);
            return studentID;
        }else{
            const logger = new Logger('TestDetail');
            logger.error('uuid does not a valid UUID');
            throw new BadRequestException(ErrorMessages.BAD_REQUEST);
        }
    }

    
    checkIfValidUUID(str: string) {
        // Regular expression to check if string is a valid UUID
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
      
        return regexExp.test(str);
    }

    async findStudentByUUID(user_uuid : string){
        const { id } = await this.studentRepository.findOne({ where: { user_uuid } });
        if(!id) throw new BadRequestException('Not found student');
        return id;
    }
}