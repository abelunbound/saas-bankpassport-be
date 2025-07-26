import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enterprise } from './entity/enterprise.entity';
import { Equal, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RiskProfile, RiskProfileProject } from 'src/risk-profile/entity/risk-profile.entity';
import { AuthDto, EnterpriseDto, EnterpriseUserEntity, UpdateEnterpriseDto } from './dto/enterprise.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/utils/types/jwt.types';
import { UsersService } from 'src/users/users.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { CollaboratorService } from 'src/collaborator/collaborator.service';
import { STATUS_ENUM } from 'src/users/entity/users.entity';

@Injectable()
export class EnterpriseService {
    constructor(
        @InjectRepository(Enterprise) public repo: Repository<Enterprise>,
        private configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(RiskProfile) public risk_profile: Repository<RiskProfile>,
        private readonly userService: UsersService,
        private readonly collaboratorService: CollaboratorService,
        @InjectRepository(RiskProfileProject) private riskProfileProject: Repository<RiskProfileProject>,

    ) { }

    public async create(enterpriseDto: EnterpriseDto) {

        const enterpriseUser = await this.repo.findOne({ where: { email: enterpriseDto.email } })
        if (enterpriseUser) throw new BadRequestException('Email already exist')

        const user = this.repo.create({
            ...enterpriseDto,
            password: this.hashData(enterpriseDto.password)
        })
        await this.repo.save(user)
        delete user.password
        const tokens = await this.getToken(user.id as any, user.email);
        return tokens;
    }

    public async getAllEnterprise() {
        return await this.repo.find()
    }

    hashData(data: string) {
        return bcrypt.hashSync(data, 10);
    }

    async getToken(id: string, email: string) {
        const jwtPayload: JwtPayload = {
            id,
            email,
        };
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                expiresIn: '2h',
                secret: this.configService.get<string>('JWT_SECRET_AT'),
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('JWT_SECRET_RT'),
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken: at,
            refreshToken: rt,
        };
    }


    async login(authDto: AuthDto) {
        const user = await this.repo.findOne({ where: { email: authDto.email } })
        if (!user) throw new BadRequestException('User does not exist.');

        const isPasswordMatched = await bcrypt.compare(authDto.password, user.password);
        if (!isPasswordMatched) {
            throw new BadRequestException('Wrong Password or email is invalid');
        }
        const tokens = await this.getToken(user.id as any, user.email);
        return tokens;
    }

    public async getUser(id: string) {

        const user = await this.repo.findOne({ where: { id: id as any }, relations: ['users'] });
        if (!user) throw new BadRequestException("User not found")
        let auth_user = { ...user }
        delete auth_user.password
        return auth_user
    }

    public async getAllEnterpriseUser(enterpriseId: number) {
        return await this.userService.user.find({
            where: {
                enterprise: {
                    id: Equal(enterpriseId)
                }
            }
        })
    }

    public async completeEnterpriseProfile(enterprise_id: string, payload: UpdateEnterpriseDto) {
        await this.update(enterprise_id, payload)
        return "Profile completed successfully"
    }


    public async getAllStats(enterprise_id: number) {
        const users = await this.getAllEnterpriseUser(enterprise_id)

        const risk_profiles = await this.risk_profile.find({
            where: {
                enterprise: {
                    id: enterprise_id
                }
            }
        })
        const completed = users.filter((user) => user.status === STATUS_ENUM.COMPLETED)
        const pending = users.filter((user) => user.status === STATUS_ENUM.PENDING)
        const expired = users.filter((user) => user.status === STATUS_ENUM.EXPIRED)

        return {
            users: users.length, risk_profiles: risk_profiles.length, completed: completed.length, pending: pending.length, expired: expired.length
        }

    }


    public async getAllCollaborators(enterprise_id: number) {
        return await this.collaboratorService.getAllCollaborators(enterprise_id)
    }

    public async update(id: string, attrs: Partial<Enterprise>) {
        const user = await this.getUser(id)
        Object.assign(user, attrs)
        return await this.repo.save(user);
    }

    async refreshUser(id: string) {
        const auth_user = await this.repo.findOne({ where: { id: id as any } })
        const tokens = await this.getToken(id, auth_user.email);
        return tokens;
    }
}
