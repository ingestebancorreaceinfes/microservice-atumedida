import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { JwtModule } from '@nestjs/jwt';
import { Student } from 'src/student/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test,Student]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { 
        expiresIn: 3600 
      }
    }),
  ],
  controllers: [TestController],
  providers: [TestService]
})
export class TestModule {}
