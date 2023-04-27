import { Global, Module } from '@nestjs/common';
import { StudentTestService } from './student_test.service';
import { StudentTestController } from './student_test.controller';
import { StudentTest } from './entities/student_test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StudentModule } from 'src/student/student.module';
import { TestApplicationModule } from 'src/test_application/test_application.module';
import { TestDetailModule } from 'src/test_detail/test_detail.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([StudentTest]),
    AuthModule,
    StudentModule,
    TestApplicationModule,
    TestDetailModule
  ],
  controllers: [StudentTestController],
  providers: [StudentTestService],
  exports: [StudentTestService]
})
export class StudentTestModule {
  public static globalResponses = {};//1. Definir variable global en el modulo
}
