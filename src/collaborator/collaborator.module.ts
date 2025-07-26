import { Module, forwardRef } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CollaboratorController } from './collaborator.controller';
import { EnterpriseService } from 'src/enterprise/enterprise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborator } from './entity/collaborator.entity';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([Collaborator]),

    ],
    providers: [CollaboratorService,JwtService],
    controllers: [CollaboratorController],
    exports: [CollaboratorService]
})
export class CollaboratorModule { }
