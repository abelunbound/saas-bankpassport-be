import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enterprise } from './entity/enterprise.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RiskProfile } from 'src/risk-profile/entity/risk-profile.entity';
import { AuthDto, EnterpriseDto } from './dto/enterprise.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/utils/types/jwt.types';

@Injectable()
export class EnterpriseService {
    constructor(
        @InjectRepository(Enterprise) public repo: Repository<Enterprise>,
        private configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(RiskProfile) public risk_profile: Repository<RiskProfile>,
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
        return user
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
        return user
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
