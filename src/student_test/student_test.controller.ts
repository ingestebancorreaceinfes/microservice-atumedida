import { Controller, Post, Body, UseGuards, Get, Param, NotFoundException } from '@nestjs/common';
import { StudentTestService } from './student_test.service';
import { CreateStudentTestDto } from './dto/create-student_test.dto';
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorMessages } from 'src/common/enum/error-messages.enum';
import { StudentTestSchema } from './schema/student-test.schema';
import { Headers } from '@nestjs/common';
import { AuthnGuard } from 'src/auth/guards/auth.guard';
import { SuccessMessages } from 'src/common/enum/success-messages.enum';

@ApiTags('StudentTest')
@Controller()
export class StudentTestController {
  constructor(private readonly studentTestService: StudentTestService) {}

  @ApiResponse({status:201, description: SuccessMessages.REGISTER_SUCCESS_STUDENT_TEST, schema:{type:'object',example:StudentTestSchema}})
  @ApiBadRequestResponse({ status: 400, description: ErrorMessages.BAD_REQUEST })
  @ApiResponse({ status: 401, description: ErrorMessages.NOT_VALID_TOKEN })
  @ApiResponse({ status: 403, description: ErrorMessages.FORBIDDEN })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @ApiHeader({name: 'Authorization',description: 'Generated token by authentication microservice',required: true})
  @UseGuards(AuthnGuard) 
  @Post('student-test')
  saveStudentTest(@Headers('Authorization') request: any,@Body() data: CreateStudentTestDto) {
    const jwt = request.replace('Bearer ', '');
    return this.studentTestService.saveStudentTest(jwt,data);
  }

  @ApiOkResponse({ description: SuccessMessages.OK_RESPONSE })
  @ApiResponse({ status: 401, description: ErrorMessages.NOT_VALID_TOKEN })
  @ApiResponse({ status: 403, description: ErrorMessages.FORBIDDEN })
  @ApiResponse({status:500, description: ErrorMessages.APPLICATION_ERROR})
  @ApiHeader({name: 'Authorization',description: 'Generated token by authentication microservice',required: true})
  //@UseGuards(AuthnGuard) 
  @Get('student/test/:id/results')
  async testResults(@Param('id') id: string, @Headers('Authorization') request: any) {
    const jwt = request.replace('Bearer ', '');

    const testResults = await this.studentTestService.testResults(jwt,id);

    if(!testResults) throw new NotFoundException(`There are no associated results with test ${id}`);
    return testResults;
  }  
  @Get('testresult/:testid')
  async testMeasureResult(@Param('id') id: string){
    const results = await this.studentTestService.findStudentTest('c30c7eec-eae5-41ce-bc7c-4f719eabfda3','5206b98b-ac51-484e-9a2e-1b72310b435d');    
    const testResults = await this.studentTestService.findTestResults('5206b98b-ac51-484e-9a2e-1b72310b435d');
    if(!results || !testResults)
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    let maxScore = 0;
    let studentScore = 0;
    let promedioExito = 0;
    let promedioEstudianteExito = 0;
    let promedio = 0;
    let competencesNames:object = null;
    let masteredTask:Array<any> = null;
    let taskNotMastered:Array<any> = null;
    const objStudentResponses:Array<any> = results.responses as any as Array<any>;
    const objTestResults:Array<any> = testResults as any as Array<any>;
    if(objTestResults) competencesNames={};
    objTestResults.forEach((value:any) => competencesNames[value.competence]={});
    let isValid=false;
    objStudentResponses.forEach((studentResponse:any) => { 
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
          if (!masteredTask.find((el) => {             
            return el.name === testResult.task; })){
            masteredTask.push({name:testResult.task});
          }
          if(!competencesNames[testResult.competence].hasOwnProperty('successscore')){
            competencesNames[testResult.competence]['successscore']=0
          }
          competencesNames[testResult.competence]['successscore']+=Math.exp(testResult.measure)/(1+Math.exp(testResult.measure));
          studentScore = studentScore + (Math.exp(testResult.measure)/(1+Math.exp(testResult.measure)));
        }
        else{
          if(!taskNotMastered) taskNotMastered = [];
          if (!taskNotMastered.find((el) => {             
            return el.name === testResult.task; })){
              taskNotMastered.push({name:testResult.task});
          }
        }
      }
    });
    promedioExito = maxScore/testResults.length;
    console.log(promedioExito, masteredTask);
    promedioEstudianteExito = studentScore/testResults.length;
    promedio = Number((promedioEstudianteExito*100/promedioExito).toFixed(2));
    competencesNames = Object.keys(competencesNames).map(value => {
      const scoresCompetences = competencesNames[value]
      const successScoreCompetence = scoresCompetences.successscore/testResults.length;
      const scoreCompetenceAverage = successScoreCompetence*100/promedioExito;
      scoresCompetences["score"]=isNaN(scoreCompetenceAverage)? 0 :Number(scoreCompetenceAverage.toFixed(2));
      scoresCompetences["name"]=value;      
      delete scoresCompetences["maxscore"];
      delete scoresCompetences["numberofquestions"];
      delete scoresCompetences["successscore"];
      return scoresCompetences
      
    })
    console.log(competencesNames);
   return {promedio,competencesNames,taskNotMastered,masteredTask};
  }
}
