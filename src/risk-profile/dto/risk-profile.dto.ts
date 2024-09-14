import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, Min, MinDate, ValidateNested } from "class-validator";
import { PickType, PartialType } from '@nestjs/mapped-types';
import { Type } from "class-transformer";
import { TINK_CHECKS, UsersDto } from "src/users/dto/users.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Express } from 'express'

export enum IType {
    MINUTES = "MINUTES",
    HOURS = 'HOURS',
    DAYS = 'DAYS'
}

export enum IProvider {
    MONO = 'mono',
    TINK = 'tink'
}


export interface RiskProfileCheck {
    riskProfileId: number,
    createdAt: Date,
    userId: number,
    provider: IProvider,
    check?: TINK_CHECKS
}

export class RiskProfileDto extends PartialType(PickType(UsersDto, ["email", "first_name", "last_name", "type"])) {
    @IsString()
    @IsNotEmpty()
    course: string

    @IsNumber()
    @IsNotEmpty()
    tuition_check: number

    @IsNotEmpty()
    @IsBoolean()
    living_expense_check: boolean

    @IsNotEmpty()
    @IsBoolean()
    balance_overview: boolean

    @IsNotEmpty()
    @IsBoolean()
    balance_forcast: boolean

    @IsNotEmpty()
    @IsBoolean()
    probability_of_default: boolean

    @IsNotEmpty()
    @IsBoolean()
    account_history: boolean

    @IsString()
    @IsNotEmpty()
    academic_year: string

    @IsNotEmpty()
    @IsNumber()
    enterpriseId: string


    // @IsNotEmptyObject()
    // @IsObject()
    // @ValidateNested()
    // @Type(() => ExpirationDTO)
    // expiration: {
    //     duration: number,
    //     type: IType
    // }
}

class ExpirationDTO {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    duration: number

    @IsString()
    @IsEnum(IType)
    @IsNotEmpty()
    type: IType
}

export class MonoRiskProfileDTO {
    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsString()
    @IsNotEmpty()
    code: string
}

const getStartOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};

export class RiskAnalysisProjectDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    project_name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @MinDate(getStartOfDay(new Date()), { message: 'The start date must not be in the past.' })
    startDate: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    endDate: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    riskProfileId: number

    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File
}



export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File
}