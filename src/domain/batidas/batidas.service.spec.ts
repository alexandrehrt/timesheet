import { Test, TestingModule } from '@nestjs/testing';
import { BatidasService } from './batidas.service';

describe('BatidasService', () => {
  let service: BatidasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatidasService],
    }).compile();

    service = module.get<BatidasService>(BatidasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
