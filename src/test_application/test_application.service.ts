import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestApplication } from './entities/test_application.entity';
import { Repository } from 'typeorm';


@Injectable()
export class TestApplicationService {

  constructor(
    @InjectRepository(TestApplication) private readonly testApplicationRepository: Repository<TestApplication>
  ){}

  async findTypeScore(testId: string) {
    const { typescore_id } = await this.testApplicationRepository.findOne({ where: { test_id: testId }  });
    return typescore_id;
  }
  
}