import { Module } from '@nestjs/common';
import { StudentTestService } from './student_test.service';
import { StudentTestController } from './student_test.controller';
import { StudentTest } from './entities/student_test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student/entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentTest,Student]),
    AuthModule
  ],
  controllers: [StudentTestController],
  providers: [StudentTestService]
})
export class StudentTestModule {}
