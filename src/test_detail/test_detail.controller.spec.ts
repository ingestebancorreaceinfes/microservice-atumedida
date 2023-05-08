import { Test, TestingModule } from '@nestjs/testing';
import { TestDetailController } from './test_detail.controller';
import { TestDetailService } from './test_detail.service';

describe('TestDetailController', () => {
  let controller: TestDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestDetailController],
      providers: [TestDetailService],
    }).compile();

    controller = module.get<TestDetailController>(TestDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
