import { Test, TestingModule } from '@nestjs/testing';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

describe('AppController', () => {
  let offersController: OffersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [OffersService],
    }).compile();

    offersController = app.get<OffersController>(OffersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
    });
  });
});
