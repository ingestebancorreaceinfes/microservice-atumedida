import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestDetail } from './entities/test_detail.entity';
import { Repository } from 'typeorm';
import { TestApplicationService } from 'src/test_application/test_application.service';
import { StudentTestService } from 'src/student_test/student_test.service';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class TestDetailService {

    constructor(
        @InjectRepository(TestDetail) private readonly testDetailRepository: Repository<TestDetail>,
        private readonly testApplicationService: TestApplicationService,
        private readonly studentTest: StudentTestService,
        private readonly studentService: StudentService,
    ){}
    
    async testScore(token: string, id:string){
        const typeTestScore = await this.testApplicationService.findTypeScore(id);

        switch(typeTestScore){
            case 1:
                const correctAnswers = await this.findQuentionAnswers(id);
                const studentId = await this.studentService.getStudentId(token);
                const selectedAnswers = await this.studentTest.findStudentResponses(studentId.toString());

                let goodAnswers = 0;

                for (let i = 0; i < correctAnswers.length; i++) {
                    if (correctAnswers[i].answer === selectedAnswers[i].option) {
                        goodAnswers += 1; 
                    }
                }
                console.log(goodAnswers);
                return goodAnswers;
            case 2:
                break;
            default:
                break;
        }
    }

    async findQuentionAnswers(testId: string){
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