import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { ServiceTestAService } from 'src/service-test-a/service-test-a.service';

@Injectable()
export class ServiceTestBService {
  constructor(@Inject(forwardRef(() => ServiceTestAService)) private serviceTestAService: ServiceTestAService) { }

  ccc() {
    return 'ccc';
  }

  eee() {
    return this.serviceTestAService.ddd() + 'eee';
  }
}
