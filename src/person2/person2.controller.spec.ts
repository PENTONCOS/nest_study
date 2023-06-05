import { Test, TestingModule } from '@nestjs/testing';
import { Person2Controller } from './person2.controller';
import { Person2Service } from './person2.service';

describe('Person2Controller', () => {
  let controller: Person2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Person2Controller],
      providers: [Person2Service],
    }).compile();

    controller = module.get<Person2Controller>(Person2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
