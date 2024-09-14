import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { JwtService } from '@nestjs/jwt';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';

@Module({
  imports: [
    forwardRef(() => EnterpriseModule),
    TypeOrmModule.forFeature([Users])
  ],
  providers: [UsersService, JwtService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
