import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { StudentTestModule } from './student_test/student_test.module';
import { AuthModule } from './auth/auth.module';
import { TestApplicationModule } from './test_application/test_application.module';
import { TestDetailModule } from './test_detail/test_detail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities:true
    }),
    StudentModule,
    TestModule,
    StudentTestModule,
    AuthModule,
    TestApplicationModule,
    TestDetailModule
  ]
})
export class AppModule {}
