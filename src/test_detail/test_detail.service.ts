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

    async getResults(testId: string) {
        const query = await this.testDetailRepository.query(
            `select td."order" "order",td.question_id,q.answer,
            (select c.name from competences c where c.id = q.competence_id) competence,
            (select co.name from components co where co.id = q.component_id) component,
            (select tas.name from tasks tas where tas.id = q.task_id) task,
            (select a.name from areas a where a.id = td.area_id) area,
            (select s.name from subjects s where s.id = td.subject_id) subject
            from tests_details td
            inner join questions q on q.id = td.question_id
            where td.test_id = '${testId}'
            order by td.order;`
        );

        return query;
    }
}