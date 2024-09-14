import { Inject, Injectable, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnterpriseService } from 'src/enterprise/enterprise.service';
import axios from 'axios';
import * as transactions_data from '../../data'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) public user: Repository<Users>,
        private configService: ConfigService,
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => EnterpriseService))
        private readonly enterpriseService: EnterpriseService
    ) { }

    public async update(id: string, attrs: Partial<Users>) {
        const user = await this.getUser(id);
        Object.assign(user, attrs)
        return this.user.save(user);
    }

    public async getUser(id: string) {
        const user = await this.user.findOne({
            where: { id: id as any }
        })
        if (!user) throw new BadRequestException('User not found')
        return user
    }

    public async getOneUser(id: string) {
        const user = await this.user.findOne({ where: { id: id as any }, relations: ["enterprise", "riskProfile"] })
        if (!user) throw new BadRequestException('User not found')
        return user
    }

    public async updateUserTinkIncome(id: string, userId: string) {
        try {
            const response = await axios(`${process.env.TINK_API}/api/v1/oauth/token`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: new URLSearchParams({
                    'client_id': process.env.TINK_CLIENT_ID,
                    'client_secret': process.env.TINK_CLIENT_SECRET,
                    'grant_type': 'client_credentials',
                    'scope': 'account-verification-reports:read, expense-checks:readonly, income-checks:readonly, risk-insights:readonly'
                }).toString(),
            })
            const url = `${process.env.TINK_API}/v2/income-checks/${id}`
            const userAccountDetails = await axios(url, {
                method: 'get',
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`
                }
            })
            const userDetails = await this.getUser(userId)
            const user = await this.update(
                userId,
                {
                    account: {
                        ...userDetails.account,
                        'income': userAccountDetails?.data
                    }
                }
            )
            return user
        } catch (e) {
            console.log(e)
        }

    }

    public async processCode(code: string) {
        try {
            const response = await axios(`${process.env.MONO_BASE_URL}/accounts/auth`, {
                method: 'post',
                headers: {
                    'Content-Type': "application/json",
                    "Accept": "application/json",
                    "mono-sec-key": process.env.MONO_SK
                },
                data: {
                    code
                }
            })
            return response.data
        } catch (e) {
            console.log(e)
        }
    }

    public async updateUserTransactions(id: string, code: string) {
        try {
            console.log('user id = ', id, code)
            const user = await this.getOneUser(id);
            const response = await axios(`${process.env.TINK_API}/api/v1/oauth/token`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: new URLSearchParams({
                    'client_id': process.env.TINK_CLIENT_ID,
                    'client_secret': process.env.TINK_CLIENT_SECRET,
                    'grant_type': 'authorization_code',
                    'code': code,
                }).toString(),
            })

            const transactions = await axios(`${process.env.TINK_API}/data/v2/transactions`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${response.data.access_token}`
                }
            })
            console.dir(transactions.data, { depth: null })
            return await this.update(user.id as any, {
                account: {
                    ...user.account,
                    transactions: Array.isArray(transactions.data?.transactions) && transactions.data?.transactions.length
                        ? transactions.data?.transactions
                        : (transactions_data.data as any)
                }
            })

        } catch (e) {
            console.log(e, 'error__')
        }
    }

    public async getMonoTransactions(id: string) {
        try {
            const response = await axios(`${process.env.MONO_BASE_URL}/accounts/${id}/transactions`, {
                method: 'get',
                headers: {
                    'Content-Type': "application/json",
                    "Accept": "application/json",
                    "mono-sec-key": process.env.MONO_SK
                },
                params: {
                    paginate: false
                }

            })
            return response.data
        } catch (e) {
            console.log(e)
        }
    }
}
