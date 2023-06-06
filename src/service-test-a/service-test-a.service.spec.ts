import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTestAService } from './service-test-a.service';

describe('ServiceTestAService', () => {
  let service: ServiceTestAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceTestAService],
    }).compile();

    service = module.get<ServiceTestAService>(ServiceTestAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
