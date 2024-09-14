import { Test, TestingModule } from '@nestjs/testing';
import { RiskProfileProjectService } from './risk-profile-project.service';

describe('RiskProfileProjectService', () => {
  let service: RiskProfileProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiskProfileProjectService],
    }).compile();

    service = module.get<RiskProfileProjectService>(RiskProfileProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
