import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RiskProfile, RiskProfileProject } from './entity/risk-profile.entity';
import { Equal, Repository } from 'typeorm';
import { EnterpriseService } from 'src/enterprise/enterprise.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as xlsx from 'xlsx';
import { IUserDto, TINK_CHECKS } from 'src/users/dto/users.dto';
import { IProvider, MonoRiskProfileDTO, RiskAnalysisProjectDTO, RiskProfileCheck, RiskProfileDto } from './dto/risk-profile.dto';
import { AccountTypes } from 'src/users/entity/users.entity';
import { decrypt, encrypt } from 'src/helpers/hash.helpers';
import { formatCurrency } from 'src/helpers/utils.helpers';
import { pdfString } from 'src/helpers/pdf-string';
import * as mono_test_json from '../../mono-test'
import { ApiResult } from 'src/utils/actions/action.response';
import * as Joi from '@hapi/joi';


@Injectable()
export class RiskProfileService {
    constructor(
        @InjectRepository(RiskProfile) private riskProfile: Repository<RiskProfile>,
        @InjectRepository(RiskProfileProject) private riskProfileProject: Repository<RiskProfileProject>,
        private enterpriseService: EnterpriseService,
        private userService: UsersService,
        private notificationService: NotificationsService,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
        @Inject('XLSX') private XLSX: typeof xlsx
    ) { }

    public async createProfile(riskProfileDto: IUserDto, riskProfileId: number, expTime: string) {

        const enterprise = await this.enterpriseService.repo.findOne({
            where: {
                id: Number(riskProfileDto.enterpriseId)
            },

        })
        // Check If the user to be created already exist in this organization
        const user = await this.userService.user.findOne({
            where: {
                email: riskProfileDto.email,
                enterprise: {
                    id: enterprise.id
                }
            },
            relations: ['enterprise']
        })
        if (user) throw new BadRequestException(`${riskProfileDto.email} is already in this organization`)

        const profile = await this.riskProfile.findOne({
            where: {
                id: riskProfileId
            }
        })

        const newUser = this.userService.user.create({
            email: riskProfileDto.email,
            first_name: riskProfileDto.first_name,
            last_name: riskProfileDto.last_name,
            type: riskProfileDto.country,
            enterprise: enterprise,
            riskProfile: [profile],
        })

        let url = "";
        //  Ref format - {risk profile id} BPASS {current time} BPASS {user id}  BPASS {GATEWAY}
        const ref = `${profile.id}BPASS${new Date().getTime()}BPASS${newUser.id}`
        const payload: RiskProfileCheck = {
            riskProfileId: profile.id,
            createdAt: new Date(),
            userId: newUser.id,
            provider: IProvider.MONO
        }
        await this.userService.user.save(newUser)

        await this.userService.update(newUser.id as any, {
            enterprise: enterprise
        })
        if (riskProfileDto.country === AccountTypes.NIGERIA) {
            payload.provider = IProvider.MONO;
            const encryptedData = encrypt(JSON.stringify(payload), this.configService.get<string>("JWT_SECRET_AT"))
            
            // const mono = await this.userService.initiateMono({
            //     first_name: newUser.first_name,
            //     last_name: newUser.last_name,
            //     ref: encryptedData,
            //     email: newUser.email
            // })
            // url = mono.data?.mono_url;
            url = `${this.configService.get<string>("WEB_CLIENT_URL_DEV")}/auth/mono/${newUser.id}?provider=${IProvider.MONO}&ref=${encryptedData}`
        } else if (riskProfileDto.country === AccountTypes.EUROPE) {
            payload.provider = IProvider.TINK;
            payload.check = TINK_CHECKS.TRANSACTIONS
            const encryptedData = encrypt(JSON.stringify(payload), this.configService.get<string>("JWT_SECRET_AT"))
            url = `https://link.tink.com/1.0/transactions/connect-accounts?client_id=${this.configService.get<string>("TINK_CLIENT_ID")}&redirect_uri=${this.configService.get<string>("SERVER_URL")}/risk-profile/tink-callback&market=GB&state=${encryptedData}`
        }
        // Send Email to User with Risk Profile link

        await this.notificationService.sendEmail({
            to: newUser.email,
            subject: riskProfileDto.country === AccountTypes.EUROPE
                ? `${enterprise.enterprise_name} ${payload?.check} check`
                : "Complete risk profile",
            template: "./risk-profile",
            context: {
                name: `${newUser.first_name} ${newUser.last_name}`,
                expiration: expTime,
                url,
                orgName: enterprise.enterprise_name,
                type: TINK_CHECKS.TRANSACTIONS
            }
        })
        // await this.enterpriseService.update(riskProfileDto.enterpriseId, {
        //     users: [...enterprise.users, newUser]
        // })
        return newUser
    }
    public async tinkCallBack(params: Record<string, string>) {
        if (params?.state) {
            const decryptedData = JSON.parse(decrypt(params.state, this.configService.get<string>("JWT_SECRET_AT")) ?? "{}")
            if (decryptedData?.userId && decryptedData?.riskProfileId && decryptedData?.provider === IProvider.TINK) {
                if (decryptedData?.check === TINK_CHECKS.TRANSACTIONS && params?.code) {
                    const user = await this.userService.updateUserTransactions(decryptedData.userId, params.code)
                    const riskProfile = await this.riskProfile.findOne({
                        where: {
                            id: decryptedData?.riskProfileId,
                        },
                        relations: ['enterprise']
                    })
                    const payload: RiskProfileCheck = {
                        riskProfileId: decryptedData.riskProfileId,
                        createdAt: new Date(),
                        userId: user.id,
                        provider: IProvider.TINK,
                        check: TINK_CHECKS.INCOME
                    }
                    const encrypted = encrypt(JSON.stringify(payload), this.configService.get<string>("JWT_SECRET_AT"))
                    const url = `https://link.tink.com/1.0/income-check/create-report?client_id=${this.configService.get<string>("TINK_CLIENT_ID")}&redirect_uri=${this.configService.get<string>("SERVER_URL")}/risk-profile/tink-callback&market=GB&state=${encrypted}&locale=en_US`
                    await this.notificationService.sendEmail({
                        to: user.email,
                        subject: riskProfile ? `${riskProfile.enterprise.enterprise_name} ${TINK_CHECKS.INCOME} check` : "Complete risk profile",
                        template: "./risk-profile",
                        context: {
                            name: `${user.first_name} ${user.last_name}`,
                            url,
                            orgName: riskProfile.enterprise.enterprise_name || "",
                            type: TINK_CHECKS.INCOME,
                            expiration: null
                        }
                    })
                } else if (decryptedData?.check === TINK_CHECKS.INCOME && params?.income_check_id) {
                    const user = await this.userService.updateUserTinkIncome(params?.income_check_id, decryptedData.userId);
                    await this.tinkPdf(user.id.toString())
                }
            }
        }
    }
    public async getAllRiskProfile() {
        return await this.riskProfile.find()
    }

    public async createRiskProfile(riskProfileDto: RiskProfileDto, enterprise_id: string) {
        const course = await this.riskProfile.findOne({
            where: {
                course: riskProfileDto.course
            }
        })

        if (course) return ApiResult.error('This course already exist')
        const enterprise = await this.enterpriseService.getUser(enterprise_id)
        const profile = this.riskProfile.create({
            ...riskProfileDto,
            enterprise: enterprise
        });
        return await this.riskProfile.save(profile)
    }

    public async tinkPdf(userId: string) {
        const user = await this.userService.getOneUser(userId)
        const transactions_table_header = [
            "Amount",
            "Currency",
            "Description",
            "Date",
            "Type",
            "Status"
        ]
        const transactions_table_data = user.account.transactions.map((entry: any) => ({
            amount: formatCurrency(entry?.amount?.value?.unscaledValue, entry?.amount?.currencyCode),
            currency: entry?.amount?.currencyCode,
            description: entry?.descriptions?.original,
            date: entry?.dates?.booked,
            type: entry?.types?.type,
            status: entry?.status
        }))

        const account_table_header = [
            "Account number",
            "Name",
            "Financial institution name",
            "Holder names",
            "Role"
        ]

        const account_table_body = (user.account?.income as any)?.accounts?.map((entry: any) => ({
            account_number: entry?.accountNumber,
            name: entry?.name,
            financialInstitutionName: entry?.financialInstitutionName,
            holderNames: entry?.holderNames?.toString(),
            users: Array.isArray(entry?.users) ? entry.users.map((ele) => ele?.role) : ""
        }))

        const summary_by_months_table_header = [
            "Title",
            "Total",
            "Mean",
            "Median",
            "Min",
            "Max"
        ]

        const summary_by_months_table_body = []

        // last3Months
        if (typeof (user.account.income as any)?.income?.summary?.summaryByMonths?.lastThreeMonths === 'object') {
            const last3Months = (user.account.income as any)?.income?.summary?.summaryByMonths?.lastThreeMonths;
            const keys = Object.keys(last3Months);
            const arr: Record<string, string> = {
                title: "Last 3 months"
            }
            keys.map((entry) => {
                arr[entry] = `${formatCurrency(last3Months[entry]?.unscaledValue, 'GBP')}`
            })
            summary_by_months_table_body.push(arr)
        }
        // lastSixMonths
        if (typeof (user.account.income as any)?.income?.summary?.summaryByMonths?.lastSixMonths === 'object') {
            const lastSixMonths = (user.account.income as any)?.income?.summary?.summaryByMonths?.lastSixMonths;
            const keys = Object.keys(lastSixMonths);
            const arr: Record<string, string> = {
                title: "Last 6 months"
            }
            keys.map((entry) => {
                arr[entry] = `${formatCurrency(lastSixMonths[entry]?.unscaledValue, 'GBP')}`
            })
            summary_by_months_table_body.push(arr)
        }

        // lastTwelveMonths
        if (typeof (user.account.income as any)?.income?.summary?.summaryByMonths?.lastTwelveMonths === 'object') {
            const lastTwelveMonths = (user.account.income as any)?.income?.summary?.summaryByMonths?.lastTwelveMonths;
            const keys = Object.keys(lastTwelveMonths);
            const arr: Record<string, string> = {
                title: "Last 12 months"
            }
            keys.map((entry) => {
                arr[entry] = `${formatCurrency(lastTwelveMonths[entry]?.unscaledValue, 'GBP')}`
            })
            summary_by_months_table_body.push(arr)
        }

        const enterprise_data = {
            enterprise_id: user.enterprise?.id || 1,
            risk_number: 1, //user.riskProfile?.id,
            enterprise_name: user.enterprise.enterprise_name,
            currency: 'GBP',
            report_version: '1.0',
        }

        const user_details = {
            name: `${user.last_name} ${user.first_name}`,
            country: user.type,
            studentId: 'Not Assigned',
            account_name: account_table_body?.length ? account_table_body[0]?.holderNames : "",
            account_number: account_table_body?.length ? account_table_body[0]?.account_number : "",
            address: 'Nil',
            email: user.email,
            phone_number: 'Nil'
        }
        const content = pdfString(
            transactions_table_header,
            transactions_table_data,
            account_table_header,
            account_table_body,
            enterprise_data,
            user_details,
            summary_by_months_table_header,
            summary_by_months_table_body,
            null
        )
        await this.eventEmitter.emit("risk_profile.completed", content, user)
    }

    public async monoPdf(userId: string) {
        const user = await this.userService.getOneUser(userId);
        const data: any = user.account.income
        const transactions_table_header = [
            "Type",
            "Amount",
            "Narration",
            "Balance",
            "Date",
            "Currency"
        ]
        const transactions_table_data = user.account.transactions.map((entry: any) => ({
            type: entry?.type,
            amount: formatCurrency(entry?.amount, entry?.amount?.currency, entry?.currency),
            narration: entry?.narration,
            balance: entry?.balance,
            date: new Date(entry?.date).toDateString(),
            currency: entry?.currency
        }))
        const enterprise_data = {
            enterprise_id: user.enterprise?.id || 1,
            risk_number: 1, //user.riskProfile?.id,
            enterprise_name: user.enterprise.enterprise_name,
            currency: 'NGN',
            report_version: '1.0',
        }

        const user_details = {
            name: `${user.last_name} ${user.first_name}`,
            country: user.type,
            studentId: 'Not Assigned',
            account_name: data?.accountName,
            account_number: data?.accountNumber,
            address: 'Nil',
            email: user.email,
            phone_number: 'Nil',
            BVN: data?.account,
        }

        const account_table_header = [
            "Income type",
            "Frequency",
            "Monthly average",
            "Average income amount",
            "Last income date",
            "Last income amount",
            "Periods with income",
            "Number of incomes",
            "Number of months"
        ]

        const account_table_body = data?.income_streams?.map((entry: any) => ({
            income_type: entry?.income_type,
            frequency: entry?.frequency,
            monthly_average: formatCurrency(entry?.monthly_average, 'NGN'),
            average_income_amount: formatCurrency(entry?.average_income_amount, 'NGN'),
            last_income_date: entry?.last_income_date,
            last_income_amount: formatCurrency(entry?.last_income_amount, 'NGN'),
            periods_with_income: entry?.periods_with_income,
            number_of_incomes: entry?.number_of_incomes,
            number_of_months: entry?.number_of_months
        }))

        const income_streams = {
            income_source_type: data?.income_source_type,
            first_transaction_date: data?.first_transaction_date,
            last_transaction_date: data?.last_transaction_date,
            period: data?.period,
            number_of_income_streams: data?.number_of_income_streams,
            monthly_average: formatCurrency(data?.monthly_average, 'NGN'),
            monthly_average_regular: formatCurrency(data?.monthly_average_regular, 'NGN'),
            monthly_average_irregular: formatCurrency(data?.monthly_average_irregular, 'NGN'),
            total_regular_income_amount: data?.total_regular_income_amount,
            total_irregular_income_amount: data?.total_irregular_income_amount
        }

        const content = pdfString(
            transactions_table_header,
            transactions_table_data,
            account_table_header,
            account_table_body,
            enterprise_data,
            user_details,
            [],
            [],
            income_streams
        )
        await this.eventEmitter.emit("risk_profile.completed", content, user)
    }

    public async monoCallback(payload: MonoRiskProfileDTO) {
        const code = await this.userService.processCode(payload.code)
        // await this.userService.getMonoIncome(code.data.id)
        const transactions = await this.userService.getMonoTransactions(code.data.id)
        const user = await this.userService.getOneUser(payload.userId.toString())
        await this.userService.update(payload.userId.toString(), {
            account: {
                ...user.account,
                transactions: transactions.data,
                income: mono_test_json.data.data
            },
            transactions: transactions.data,
        })
        await this.monoPdf(user.id.toString())
    }

    public async createBatchRiskProfile(payload: RiskAnalysisProjectDTO, file: Express.Multer.File, enterpriseId: string) {
        const check_name = await this.riskProfileProject.findOne({
            where: {
                project_name: payload.project_name
            }
        })
        if (check_name) return ApiResult.error("Project with this name already exist")
        const profile = await this.getOneRiskProfile(enterpriseId, Number(payload.riskProfileId))
        // const project = this.riskProfileProject.create({
        //     startDate: payload.startDate,
        //     endDate: payload.endDate,
        //     riskProfile: profile,
        //     project_name: payload.project_name
        // })

        const workbook = this.XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = this.XLSX.utils.sheet_to_json(worksheet);
        const schema = Joi.array().items(
            Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().required(),
                country: Joi.string().valid(AccountTypes.EUROPE, AccountTypes.NIGERIA).required()
            }),
        );
        const startDate = new Date(payload.startDate);
        const endDate = new Date(payload.endDate);

        const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

        const expiresIn = `${differenceInHours}h`;

        const { error } = schema.validate(data);
        if (error) throw new BadRequestException(`Validation failed: ${error.message}`)

        const errors: any[] = [];
        Promise.all(
            data.map(async (entry: any) => {
                try {
                    const response = await this.createProfile({
                        first_name: entry.firstName,
                        last_name: entry.lastName,
                        email: `ayowalexy+${Math.floor(Math.random() * 100)}@gmail.com`,
                        country: entry.country,
                        enterpriseId: enterpriseId,
                    }, payload.riskProfileId, expiresIn)

                    const at = await this.jwtService.signAsync({
                        id: payload.riskProfileId,
                        userId: response.id
                    }, {
                        expiresIn,
                        secret: this.configService.get<string>('JWT_SECRET_AT'),
                    })
                    await this.userService.update(response.id.toString(), {
                        expirationToken: at
                    })

                } catch (e) {
                    console.log(e)
                    errors.push(e?.message)
                }
            })
        )
        // await this.riskProfileProject.save(project)
        return ApiResult.success(`${data.length - errors.length} created risk profile created successfully`)
    }

    public async getAllEntepriseRiskProfile(enterpriseId: string) {
        return await this.riskProfile.find({
            where: {
                enterprise: Equal(enterpriseId)
            },
            relations: ['enterprise']
        })
    }

    public async getOneRiskProfile(enterpriseId: string, riskProfileId: number): Promise<RiskProfile> {
        const data = await this.riskProfile.findOne({
            where: {
                enterprise: {
                    id: enterpriseId as any
                },
                id: riskProfileId
            },
            relations: ['enterprise']
        })
        if (!data) throw new BadRequestException("Risk profile not found")
        return data
    }

    public async deleteRiskProfile(enterpriseId: string, riskProfileId: number) {
        const profile = await this.riskProfile.findOne({ where: { id: riskProfileId, enterprise: Equal(enterpriseId) } });
        if (profile) {
            return await this.riskProfile.remove(profile)
        }
        throw new BadRequestException('Profile not found')
    }



    public async updateRiskProfile(enterpriseId: string, riskProfileId: number, attrs: Partial<RiskProfile>) {
        const profile = await this.getOneRiskProfile(enterpriseId, riskProfileId);
        Object.assign(profile, attrs)
        return await this.riskProfile.save(profile);
    }

}
