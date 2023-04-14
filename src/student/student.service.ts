import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { States, Cities, Student } from './entities/index';
import { Repository } from 'typeorm';
import { documentTypes, grades } from './data/index';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(States) private readonly statesRepository:Repository<States>,
        @InjectRepository(Cities) private readonly citiesRepository:Repository<Cities>,
        @InjectRepository(Student) private readonly studentRepository:Repository<Student>,
    ){}
    
    getDocumentTypes(): string {
        return JSON.stringify(documentTypes);//Convierte un Object JS a JSON
    }
    
    getDepartaments(): Promise<States[]> {
        return this.statesRepository.find();
    }

    getCities(): Promise<Cities[]> {
        return this.citiesRepository.find();
    }

    // getDepartamentById(id: string): Promise<States> {
    //     const state = this.statesRepository.findOne({ where: { +id } });
    //     if(!state) throw new NotFoundException();
    //     return state;
    // }
    
    getGrades(): string {
        return JSON.stringify(grades);
    }

    async studentRegister(createStudentDto: CreateStudentDto) {
        const { user_uuid } = createStudentDto; 
        const isRegister = await this.findStudentByUUID(user_uuid);
        console.log(isRegister);
        if(!isRegister) {
            const newStudent = this.studentRepository.create(createStudentDto);//crea una instancia de la entidad y copia todos las propiedades en un objeto 
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