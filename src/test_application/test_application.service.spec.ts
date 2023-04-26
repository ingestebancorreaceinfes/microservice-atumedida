import { Test, TestingModule } from '@nestjs/testing';
import { TestApplicationService } from './test_application.service';

describe('TestApplicationService', () => {
  let service: TestApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestApplicationService],
    }).compile();

    service = module.get<TestApplicationService>(TestApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
