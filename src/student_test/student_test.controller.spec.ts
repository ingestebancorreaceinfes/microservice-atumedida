import { Test, TestingModule } from '@nestjs/testing';
import { StudentTestController } from './student_test.controller';
import { StudentTestService } from './student_test.service';

describe('StudentTestController', () => {
  let controller: StudentTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentTestController],
      providers: [StudentTestService],
    }).compile();

    controller = module.get<StudentTestController>(StudentTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
