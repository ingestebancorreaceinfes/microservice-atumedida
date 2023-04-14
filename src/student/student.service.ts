import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { States, Cities } from './entities/index';
import { Repository } from 'typeorm';
import { documentTypes, grades } from './data/index';

@Injectable()
export class StudentService {

    constructor(
        @InjectRepository(States) private readonly statesRepository:Repository<States>,
        @InjectRepository(Cities) private readonly citiesRepository:Repository<Cities>,
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
    
    getGrades(): string {
        return JSON.stringify(grades);
    }

}