import { Global, Module } from '@nestjs/common';
import { StudentTestService } from './student_test.service';
import { StudentTestController } from './student_test.controller';
import { StudentTest } from './entities/student_test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StudentModule } from 'src/student/student.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([StudentTest]),
    AuthModule,
    StudentModule
  ],
  controllers: [StudentTestController],
  providers: [StudentTestService],
  exports: [StudentTestService]
})
export class StudentTestModule {
  public static globalResponses = {};//1. Definir variable global en el modulo
}
