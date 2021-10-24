import { Test, TestingModule } from '@nestjs/testing';
import { LineNotifyService } from './lineNotify.service';

describe('UsersService', () => {
  let service: LineNotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineNotifyService],
    }).compile();

    service = module.get<LineNotifyService>(LineNotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
