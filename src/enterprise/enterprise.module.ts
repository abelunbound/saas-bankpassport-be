import { Module, forwardRef } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './entity/enterprise.entity';
import { RiskProfile, RiskProfileProject } from 'src/risk-profile/entity/risk-profile.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CollaboratorService } from 'src/collaborator/collaborator.service';
import { CollaboratorModule } from 'src/collaborator/collaborator.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Enterprise, RiskProfile, RiskProfileProject]),
    CollaboratorModule  ],
  providers: [EnterpriseService, JwtService,],
  controllers: [EnterpriseController],
  exports: [EnterpriseService]
})
export class EnterpriseModule { }
