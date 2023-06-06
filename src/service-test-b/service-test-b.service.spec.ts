import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTestBService } from './service-test-b.service';

describe('ServiceTestBService', () => {
  let service: ServiceTestBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceTestBService],
    }).compile();

    service = module.get<ServiceTestBService>(ServiceTestBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
