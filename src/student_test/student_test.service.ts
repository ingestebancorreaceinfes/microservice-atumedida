import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateStudentTestDto } from './dto/create-student_test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentTest } from './entities/student_test.entity';
import { Repository } from 'typeorm';
import { StudentService } from 'src/student/student.service';
import { StudentTestModule } from './student_test.module';
import { SuccessMessages } from 'src/common/enum/success-messages.enum';
import { TestApplicationService } from 'src/test_application/test_application.service';
import { TestDetailService } from 'src/test_detail/test_detail.service';
import { ErrorMessages } from '../common/enum/error-messages.enum';

@Injectable()
export class StudentTestService {

  constructor(
    @InjectRepository(StudentTest)
    private readonly studentTestRepository: Repository<StudentTest>,
    private readonly studentService: StudentService,
    private readonly testApplicationService: TestApplicationService,
    private readonly testDetailService: TestDetailService
  ){}

  async saveStudentTest(token: string, createStudentTestDto: CreateStudentTestDto) {
    try{
      const studentId = await this.studentService.getStudentId(token);
      const studentHasTestApplied = await this.findStudentTest(studentId.toString(),createStudentTestDto.test_id);
      
      if(!studentHasTestApplied){        
        const newStudentTest = this.studentTestRepository.create(createStudentTestDto);
        newStudentTest.student_id = studentId.toString();
        StudentTestModule.globalResponses = newStudentTest.responses;//2. Utilizar variable global en el servicio
        newStudentTest.responses = JSON.stringify(newStudentTest.responses);

        await this.studentTestRepository.save(newStudentTest)
        .then( async () => { //Despues que la entidad a sido guardada
          const { goodAnswers } = await this.calculateTestScore(studentId.toString(), createStudentTestDto.test_id);        
          this.saveTotalScore(studentId.toString(), newStudentTest.test_id, goodAnswers);
          const response = {
            "status-code": 201,
            "state": "realizada",
            "message": SuccessMessages.REGISTER_SUCCESS_STUDENT_TEST
          }
  
          return JSON.stringify(response);
        });
      }else{
        const testId = createStudentTestDto.test_id;
        const questionResponses = JSON.stringify(createStudentTestDto.responses);
 
        await this.studentTestRepository
        .createQueryBuilder('')
        .update(StudentTest)
        .set({ started_at: createStudentTestDto.started_at, ended_at: createStudentTestDto.ended_at, responses: questionResponses })
        .where( "student_id = :studentId", { studentId } ) 
        .andWhere("test_id = :testId", { testId })
        .execute();
        
        StudentTestModule.globalResponses = createStudentTestDto.responses;

        const { goodAnswers } = await this.calculateTestScore(studentId.toString(), testId);
        this.saveTotalScore(studentId.toString(), testId, goodAnswers);

        const response = {
          "status-code": 201,
          "state": "realizada",
          "message": SuccessMessages.REGISTER_SUCCESS_STUDENT_TEST
        }

        return JSON.stringify(response);
      }    
    }catch(error){
      const logger = new Logger('StudentTest');
      logger.error(error);
    }
      
  }

  async findStudentTest(student_id: string, test_id: string){
    const studentTest = await this.studentTestRepository.findOne({ where: { student_id, test_id } });
    return studentTest;
  }

  async calculateTestScore(studentId:string, testId: string ){
    const typeTestScore = await this.testApplicationService.findTypeScore(testId);
    const correctAnswers = await this.testDetailService.findQuestionAnswers(testId);
    const selectedAnswers = StudentTestModule.globalResponses;
    const validatedAnswers = [];
    let goodAnswers = 0;

    switch(typeTestScore){
        case 1:
            for (const i in correctAnswers) { //Iterar sobre los indices del Array
              if (correctAnswers[i].answer === selectedAnswers[i].option) {
                goodAnswers += 1;
                validatedAnswers.push({
                  "order": selectedAnswers[i].order,
                  "student_option": selectedAnswers[i].option,
                  "is_valid": true
                });
              }else{
                validatedAnswers.push({
                  "order": selectedAnswers[i].order,
                  "student_option": selectedAnswers[i].option,
                  "is_valid": false
                });
              }
              
            }
            const competencesNames = null;
            const masteredTask = null;
            const taskNotMastered = null;
            return {
              goodAnswers,
              validatedAnswers,
              competencesNames,
              masteredTask,
              taskNotMastered
            };
        case 2:
              return await this.testMeasureResult(studentId, testId, validatedAnswers, goodAnswers );
        default:
            break;
    }
  }

  async testMeasureResult(studentId:string,testId:string,validatedAnswers:Array<any>,goodAnswers:number){
    const results = await this.findStudentTest(studentId,testId);    
    const testResults = await this.findTestResults(testId);
    if(!results || !testResults)
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    let maxScore = 0;
    let studentScore = 0;
    let successAverage = 0;
    let studentSuccessAverage = 0;
    let average = 0;
    let competencesNames:object = {};
    let masteredTask:Array<any> = null;
    let taskNotMastered:Array<any> = null;
    const objStudentResponses:Array<any> = results.responses as any as Array<any>;
    const objTestResults:Array<any> = testResults as any as Array<any>;
    if(objTestResults) competencesNames={};
    objTestResults.forEach((value:any) => competencesNames[value.competence]={});
    objStudentResponses.forEach((studentResponse:any) => { 
      let isValid=false;
      const testResult = objTestResults.find(testresult => testresult.order==studentResponse.order);
      if(testResult){
        maxScore = maxScore + (Math.exp(testResult.measure)/(1+Math.exp(testResult.measure)));
        
        if(!competencesNames[testResult.competence].hasOwnProperty('maxscore')){
          competencesNames[testResult.competence]['maxscore']=0;
          competencesNames[testResult.competence]['numberofquestions']=0;
        }
        competencesNames[testResult.competence]['numberofquestions']+=1;
        competencesNames[testResult.competence]['maxscore']+=Math.exp(testResult.measure)/(1+Math.exp(testResult.measure));
        if(studentResponse.option === testResult.answer){
          isValid=true;
          if(!masteredTask) masteredTask = [];
          masteredTask.push({name:testResult.task})
          if(!competencesNames[testResult.competence].hasOwnProperty('successscore')){
            competencesNames[testResult.competence]['successscore']=0
          }
          competencesNames[testResult.competence]['successscore']+=Math.exp(testResult.measure)/(1+Math.exp(testResult.measure));
          studentScore = studentScore + (Math.exp(testResult.measure)/(1+Math.exp(testResult.measure)));
        }
        else{
          if(!taskNotMastered) taskNotMastered = [];
          taskNotMastered.push({name:testResult.task})
        }
        validatedAnswers.push({
          "order": studentResponse.order,
          "student_option": studentResponse.option,
          "is_valid": isValid
        });
      }
    });
    

    successAverage = maxScore/testResults.length;
    studentSuccessAverage = studentScore/testResults.length;
    average = Number((studentSuccessAverage*100/successAverage).toFixed(2));
    competencesNames = Object.keys(competencesNames).map(value => {
      const scoresCompetences = competencesNames[value]
      const successScoreCompetence = scoresCompetences.successscore/testResults.length;
      const scoreCompetenceAverage = successScoreCompetence*100/successAverage;
      scoresCompetences["score"]=isNaN(scoreCompetenceAverage)? 0 :Number(scoreCompetenceAverage.toFixed(2));  
      scoresCompetences["name"]=value;      
      delete scoresCompetences["maxscore"];
      delete scoresCompetences["numberofquestions"];
      delete scoresCompetences["successscore"];
      return scoresCompetences;
    });
    goodAnswers = average
    return {
      goodAnswers,
      validatedAnswers,
      competencesNames,
      masteredTask,
      taskNotMastered
    };
  }

  async findTestResults(testId:string){
    return this.testDetailService.getResults(testId);
  }

  async saveTotalScore(studentId: string, testId: string, totalScore: number ){
    try{
      const updateTotalScore = await this.studentTestRepository
      .createQueryBuilder()
      .update(StudentTest)
      .set({ total_score: totalScore })
      .where( "student_id = :s_id", { s_id: studentId } ) 
      .andWhere("test_id = :t_id", { t_id: testId })
      .execute();

      return updateTotalScore;
    }catch(error){
      const logger = new Logger('StudentTest');
      logger.error(error);
    }
  }

  async testResults(token: string, testId: string){
    try{
      const studentId = await this.studentService.getStudentId(token);
      const query = `
      SELECT 
        t.name, 
        t.numberofquestion as total_questions,
        ROUND(CAST(total_score AS DECIMAL),2) as total_score, 
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
      const result = await this.studentTestRepository.query(query);

      if (result && result.length > 0) {
        const studentTest = result[0];
        const { responses, ...rest } = studentTest;
        StudentTestModule.globalResponses = responses;

        const { validatedAnswers, competencesNames, masteredTask, taskNotMastered } = await this.calculateTestScore(studentId.toString(),testId);

        return {
          ...rest,
          "questions": validatedAnswers,
          "competences": competencesNames,
          "masteredtasks":masteredTask,
          "tasksnotmastered":taskNotMastered
        }
      }
    }catch(error){
      const logger = new Logger();
      logger.error(error);
    }
  }

  async findTestStudentResultsByTestId(testId:string){
    return this.testDetailService.getResultsWithQuestionsDetails(testId);
  }
}