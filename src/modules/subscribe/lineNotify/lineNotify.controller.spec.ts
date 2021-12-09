import { Test, TestingModule } from '@nestjs/testing';
import { LineNotifyController } from './lineNotify.controller';
import { LineNotifyService } from './lineNotify.service';

describe('LineNotifyController', () => {
  let controller: LineNotifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineNotifyController],
      providers: [
        {
          provide: LineNotifyService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<LineNotifyController>(LineNotifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
