import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Test } from './entities/test.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test]),
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
