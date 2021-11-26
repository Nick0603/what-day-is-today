import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { LineNotifySubscriber } from './entities/line-notify-subscriber.entity';
import { LineNotifyService } from './lineNotify.service';

describe('UsersService', () => {
  let service: LineNotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineNotifyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(LineNotifySubscriber),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LineNotifyService>(LineNotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
