import { Test, TestingModule } from '@nestjs/testing';
import { RiskProfileController } from './risk-profile.controller';

describe('RiskProfileController', () => {
  let controller: RiskProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiskProfileController],
    }).compile();

    controller = module.get<RiskProfileController>(RiskProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
