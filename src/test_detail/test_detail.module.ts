import { Module } from '@nestjs/common';
import { TestDetailService } from './test_detail.service';
import { TestDetailController } from './test_detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDetail } from './entities/test_detail.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestDetail]),
    AuthModule,
  ],
  controllers: [TestDetailController],
  providers: [TestDetailService],
  exports: [
    TestDetailService
  ]
})
export class TestDetailModule {}
