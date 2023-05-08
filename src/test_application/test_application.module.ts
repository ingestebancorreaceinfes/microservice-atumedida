import { Module } from '@nestjs/common';
import { TestApplicationService } from './test_application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestApplication } from './entities/test_application.entity';
import { Question } from '../questions/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestApplication])
  ],
  providers: [TestApplicationService],
  exports: [TestApplicationService]
})
export class TestApplicationModule {}
