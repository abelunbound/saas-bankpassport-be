import { Test, TestingModule } from '@nestjs/testing';
import { RiskProfileProjectController } from './risk-profile-project.controller';

describe('RiskProfileProjectController', () => {
  let controller: RiskProfileProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiskProfileProjectController],
    }).compile();

    controller = module.get<RiskProfileProjectController>(RiskProfileProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
