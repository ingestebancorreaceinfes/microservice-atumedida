import { Test, TestingModule } from '@nestjs/testing';
import { TestDetailService } from './test_detail.service';

describe('TestDetailService', () => {
  let service: TestDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestDetailService],
    }).compile();

    service = module.get<TestDetailService>(TestDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
