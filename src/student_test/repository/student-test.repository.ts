import { DataSource, Repository } from "typeorm";
import { IStudentRespository } from "./istudent-test.respository";
import { StudentTest } from "../entities/student_test.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StudentRespository extends Repository<StudentTest> implements IStudentRespository {
    constructor(dataSource: DataSource) {
        super(StudentTest, dataSource.createEntityManager());
      }
    async findResults(testId: string) {
        const query = `
        SELECT 
          t.name, 
          t.numberofquestion as total_questions,
          st.total_score, 
          st.started_at, 
          st.ended_at, 
          COALESCE(CASE ta.typescore_id WHEN 1 THEN 'ACIERTO' ELSE 'PUNTAJE' END, '') AS score_type,
          st.responses
        FROM 
          students_tests st 
          INNER JOIN tests t ON st.test_id = t.id
          INNER JOIN tests_applications ta on st.test_application_id = ta.id  
        WHERE 
          st.test_id = '${testId}'
        `;
        return await this.query(query);
    }

}