import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestDetail } from './entities/test_detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestDetailService {
    constructor(
        @InjectRepository(TestDetail) private readonly testDetailRepository: Repository<TestDetail>,
    ){}
    
    async findQuestionAnswers(testId: string){
        const query = await this.testDetailRepository.query(
            `select td."order" "order",td.question_id,q.answer
            from tests_details td
            inner join questions q on q.id = td.question_id
            where td.test_id = '${testId}'
            order by td.order;`
        );

        return query;
    }

    getResults(id: string) {
        throw new Error('Method not implemented.');
    }
}