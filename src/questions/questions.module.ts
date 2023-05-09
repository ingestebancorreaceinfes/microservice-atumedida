import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { TestDetail } from '../test_detail/entities/test_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestDetail,Question])
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService]
})
export class QuestionsModule {}
