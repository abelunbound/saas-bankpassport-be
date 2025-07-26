import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collaborator } from './entity/collaborator.entity';
import { Repository } from 'typeorm';
import { CollaboratorDTO } from './dto/collaborator.dto';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from 'src/enterprise/dto/enterprise.dto';
import { EnterpriseService } from 'src/enterprise/enterprise.service';
import { JwtPayload } from 'src/utils/types/jwt.types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CollaboratorService {
    constructor(
        @InjectRepository(Collaborator) public collaborator: Repository<Collaborator>,
        private configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {

    }

    public async createCollaborator(payload: CollaboratorDTO) {
        const collaborator = await this.collaborator.findOne({
            where: {
                email: payload.email
            }
        })
        if (collaborator) throw new BadRequestException("User alread exist");

        const letters = 'ajh*tT89JJHU3&%^(OK2W90-09u8&%('
        let password = ""
        Array(letters.length).fill('_').map((entry) => password = password.concat(letters.charAt(Math.floor(Math.random() * letters.length) + 1)))
        const newCollaborator = this.collaborator.create({
            ...payload,
            user_type: "COLLABORATOR",
            _password: password,
            password: bcrypt.hashSync(password, 10)
        })
        return await this.collaborator.save(newCollaborator)
    }

    public async login(authDto: AuthDto) {
        const user = await this.collaborator.findOne({ where: { email: authDto.email }, relations: ["enterprise"] })
        if (!user) throw new BadRequestException('User does not exist.');

        const isPasswordMatched = await bcrypt.compare(authDto.password, user.password);
        if (!isPasswordMatched) {
            throw new BadRequestException('Wrong Password or email is invalid');
        }
        const tokens = await this.getToken(user.enterprise.id as any, user.enterprise.email);
        return tokens;
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
    public async getUser(user_id: string) {
        return await this.collaborator.findOne({
            where: {
                id: user_id
            },
            relations: ['enterprise'],
            select: ["email", "enterprise", "first_name", "last_name", "permission", "user_type", "id", "createdAt"]
        })
    }

    public async getAllCollaborators(enterprise_id: number) {
        return await this.collaborator.find({
            where: {
                enterprise: {
                    id: enterprise_id
                }
            },
            select: ["email", "first_name", "last_name", "permission", "_password", "user_type", "id", "createdAt"]
        })
    }
}
