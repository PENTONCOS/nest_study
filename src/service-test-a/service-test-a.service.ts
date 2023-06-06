import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { ServiceTestBService } from 'src/service-test-b/service-test-b.service';

@Injectable()
export class ServiceTestAService {
  constructor(@Inject(forwardRef(() => ServiceTestBService)) private serviceTestBService: ServiceTestBService) { }

  ddd() {
    return this.serviceTestBService.ccc() + 'ddd';
  }
}
