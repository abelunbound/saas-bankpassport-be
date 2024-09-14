import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

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
    @IsNotEmpty()
    @IsEmail()
    group_email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    personal_email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address_line_1: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address_line_2: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
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

