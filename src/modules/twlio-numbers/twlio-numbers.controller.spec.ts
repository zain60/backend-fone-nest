import { Test, TestingModule } from '@nestjs/testing';
import { TwlioNumbersController } from './twlio-numbers.controller';
import { TwlioNumbersService } from './twlio-numbers.service';

describe('TwlioNumbersController', () => {
  let controller: TwlioNumbersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwlioNumbersController],
      providers: [TwlioNumbersService],
    }).compile();

    controller = module.get<TwlioNumbersController>(TwlioNumbersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
