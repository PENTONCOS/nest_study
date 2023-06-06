import { Injectable } from '@nestjs/common';
import { ServiceTestAService } from './service-test-a/service-test-a.service';
import { ServiceTestBService } from './service-test-b/service-test-b.service';

@Injectable()
export class AppService {
  constructor(private serviceTestAService: ServiceTestAService, private serviceTestBService: ServiceTestBService) { }

  getHello(): string {
    return this.serviceTestAService.ddd() + this.serviceTestBService.eee();
  }
}
