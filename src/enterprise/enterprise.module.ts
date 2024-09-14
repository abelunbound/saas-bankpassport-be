import { Module, forwardRef } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './entity/enterprise.entity';
import { RiskProfile } from 'src/risk-profile/entity/risk-profile.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Enterprise, RiskProfile]),
  ],
  providers: [EnterpriseService, JwtService],
  controllers: [EnterpriseController],
  exports: [EnterpriseService]
})
export class EnterpriseModule {}
