import { OmitType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator'
import { UsersDto } from 'src/users/dto/users.dto'

export class EnterpriseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    first_name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name: string


}

export class AuthDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string
}


export class EnterpriseUserEntity extends OmitType(UsersDto, ["enterpriseId"]) {
    transactions: Array<any>
    account: any
}

export class UpdateEnterpriseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone_number: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    enterprise_name: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEmail()
    group_email: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEmail()
    personal_email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address_line_1: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    address_line_2: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    address_line_3: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    postcode: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string
}