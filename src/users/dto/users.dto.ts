import { IsString, IsNotEmpty, IsEmail, IsEnum, ValidateIf } from 'class-validator'
import { AccountTypes } from '../entity/users.entity';
import { PickType } from '@nestjs/mapped-types';


export enum TINK_CHECKS {
    ACCOUNT_CHECK ="account_check",
    EXPENSE = "expense",
    INCOME = "income",
    ONE_TIME_PAYMENTS = "one_time_payments",
    RISK_INSIGHTS = "risk_insight",
    RISK_DECISIONING = "risk_decisioning",
    TRANSACTIONS = "transactions"
}


export class UsersDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsEnum(AccountTypes)
    @IsNotEmpty()
    type: AccountTypes

    @IsString()
    @IsNotEmpty()
    last_name: string

    @ValidateIf(o => o.type === AccountTypes.NIGERIA)
    @IsString()
    @IsNotEmpty()
    bvn: string

    @ValidateIf(o => o.type === AccountTypes.NIGERIA)
    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    enterpriseId: string
}


export class IUserDto extends PickType(UsersDto, ["email", "last_name", "first_name", "enterpriseId"]){
    @IsNotEmpty()
    @IsEnum(AccountTypes)
    @IsString()
    country: AccountTypes
}

export class CodeDto {
    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string
}

export class TransactionsDto {
    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    id: string
}


export class ActionDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(TINK_CHECKS)
    action: TINK_CHECKS

    @IsNotEmpty()
    @IsString()
    userId: string
}


export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string


    @IsString()
    @IsNotEmpty()
    phone_number: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class MonoIntializationDTO extends  PickType(UsersDto, ["email", "first_name", "last_name"]){
    @IsString()
    @IsNotEmpty()
    ref: string
}

