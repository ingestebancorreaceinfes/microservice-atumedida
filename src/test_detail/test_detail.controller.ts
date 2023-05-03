import { Controller } from '@nestjs/common';
import { TestDetailService } from './test_detail.service';

@Controller('')
export class TestDetailController {
  constructor(private readonly testDetailService: TestDetailService) {}


}