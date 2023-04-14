import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { States, Cities, Student } from './entities/index';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student,States,Cities])
  ],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}
