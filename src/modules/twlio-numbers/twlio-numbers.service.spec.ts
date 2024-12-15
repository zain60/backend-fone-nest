import { Test, TestingModule } from '@nestjs/testing';
import { TwlioNumbersService } from './twlio-numbers.service';

describe('TwlioNumbersService', () => {
  let service: TwlioNumbersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwlioNumbersService],
    }).compile();

    service = module.get<TwlioNumbersService>(TwlioNumbersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
