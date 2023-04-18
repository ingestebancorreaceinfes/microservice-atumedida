import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { States, Cities, Student } from './entities/index';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student,States,Cities]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { 
        expiresIn: 3600 
      }
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}
