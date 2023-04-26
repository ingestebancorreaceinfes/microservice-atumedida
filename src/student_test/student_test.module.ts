import { Module } from '@nestjs/common';
import { StudentTestService } from './student_test.service';
import { StudentTestController } from './student_test.controller';
import { StudentTest } from './entities/student_test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentTest]),
    AuthModule,
    StudentModule
  ],
  controllers: [StudentTestController],
  providers: [StudentTestService]
})
export class StudentTestModule {}
