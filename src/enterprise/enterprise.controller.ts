import { EnterpriseService } from './enterprise.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthDto, EnterpriseDto, EnterpriseUserEntity, UpdateEnterpriseDto } from './dto/enterprise.dto';
import { Public } from 'src/decorators/public-decorator';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('enterprise')
export class EnterpriseController {
    constructor(private enterpriseService: EnterpriseService) { }

    @Public()
    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async createEnterprise(
        @Body() enterpriseDto: EnterpriseDto
    ) {
        return this.enterpriseService.create(enterpriseDto)
    }

    @Public()
    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(
        @Body() enterpriseDto: EnterpriseDto
    ) {
        return this.enterpriseService.create(enterpriseDto)
    }

    @Public()
    @Post('/signin')
    @HttpCode(HttpStatus.CREATED)
    async signIn(
        @Body() authDto: AuthDto
    ) {
        return this.enterpriseService.login(authDto)
    }

    @ApiBearerAuth()
    @Get('/me')
    @HttpCode(HttpStatus.CREATED)
    async getUser(
        @GetCurrentUserId() userId: string
    ) {
        return this.enterpriseService.getUser(userId)
    }

    @ApiBearerAuth()
    @Post('complete-profile')
    @HttpCode(HttpStatus.CREATED)
    async completeProfile(
        @GetCurrentUserId() userId: string,
        @Body() payload: UpdateEnterpriseDto
    ) {
        return this.enterpriseService.completeEnterpriseProfile(userId, payload)
    }

    @ApiBearerAuth()
    @Post('/:id')
    @HttpCode(HttpStatus.CREATED)
    async getUserById(
        @Param("id") userId: string
    ) {
        return this.enterpriseService.getUser(userId)
    }


    @ApiBearerAuth()
    @Get('/stats')
    @HttpCode(HttpStatus.CREATED)
    async stats(
        @GetCurrentUserId() userId: number
    ) {
        return this.enterpriseService.getAllStats(userId)
    }


    @ApiBearerAuth()
    @Get('/collaborators')
    @HttpCode(HttpStatus.CREATED)
    async getAllCollaborators(
        @GetCurrentUserId() userId: number
    ) {
        return this.enterpriseService.getAllCollaborators(userId)
    }


    @ApiBearerAuth()
    @Get('/users')
    @HttpCode(HttpStatus.CREATED)
    async getEnterpriseUsers(
        @GetCurrentUserId() userId: number
    ) {
        return this.enterpriseService.getAllEnterpriseUser(userId)
    }

}
