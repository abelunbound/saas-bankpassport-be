import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { COLLABORATOR_PERMISION } from "../entity/collaborator.entity";
import { Enterprise } from "src/enterprise/entity/enterprise.entity";


export class CollaboratorDTO {
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
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    enterprise: Enterprise

    @ApiProperty()
    @IsArray()
    @IsEnum(COLLABORATOR_PERMISION, { each: true, message: 'Each value must be a valid role' })
    @IsNotEmpty()
    permission: []
}

