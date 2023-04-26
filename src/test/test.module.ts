import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test]),
    AuthModule,
    StudentModule
  ],
  controllers: [TestController],
  providers: [TestService]
})
export class TestModule {}
