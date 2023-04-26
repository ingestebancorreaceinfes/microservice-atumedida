import { Module } from '@nestjs/common';
import { TestApplicationService } from './test_application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestApplication } from './entities/test_application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestApplication])
  ],
  providers: [TestApplicationService]
})
export class TestApplicationModule {}
