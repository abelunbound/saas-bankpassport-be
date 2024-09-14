import { Module } from '@nestjs/common';
import { RiskProfileService } from './risk-profile.service';
import { RiskProfileController } from './risk-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskProfile, RiskProfileProject } from './entity/risk-profile.entity';
import { EnterpriseModule } from '../enterprise/enterprise.module';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import * as XLSX from 'xlsx';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { RiskProfileListner } from './listeners/risk.profile.listener';

@Module({
  imports: [
    EnterpriseModule,
    UsersModule,
    NotificationsModule,
    TypeOrmModule.forFeature([RiskProfile, RiskProfileProject]),

  ],
  providers: [RiskProfileService, JwtService, RiskProfileListner, {
    provide: 'XLSX',
    useFactory: () => {
      return XLSX
    },
  }],
  controllers: [RiskProfileController]
})
export class RiskProfileModule { }
