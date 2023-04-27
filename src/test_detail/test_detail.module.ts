import { Module } from '@nestjs/common';
import { TestDetailService } from './test_detail.service';
import { TestDetailController } from './test_detail.controller';
import { TestApplicationModule } from 'src/test_application/test_application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDetail } from './entities/test_detail.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestDetail]),
    TestApplicationModule,
    AuthModule,
    StudentModule
  ],
  controllers: [TestDetailController],
  providers: [TestDetailService]
})
export class TestDetailModule {}
