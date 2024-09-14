import { Module } from '@nestjs/common';
import { RiskProfileProjectService } from './risk-profile-project.service';
import { RiskProfileProjectController } from './risk-profile-project.controller';

@Module({
  providers: [RiskProfileProjectService],
  controllers: [RiskProfileProjectController]
})
export class RiskProfileProjectModule {}
