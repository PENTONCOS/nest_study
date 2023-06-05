import { Test, TestingModule } from '@nestjs/testing';
import { Person2Service } from './person2.service';

describe('Person2Service', () => {
  let service: Person2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Person2Service],
    }).compile();

    service = module.get<Person2Service>(Person2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
