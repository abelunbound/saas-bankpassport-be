import { EnterpriseService } from './enterprise.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthDto, EnterpriseDto } from './dto/enterprise.dto';
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

}
