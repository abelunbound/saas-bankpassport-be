import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { Public } from 'src/decorators/public-decorator';
import { CollaboratorDTO } from './dto/collaborator.dto';
import { AuthDto } from 'src/enterprise/dto/enterprise.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';

@Controller('collaborator')
export class CollaboratorController {
    constructor(
        private collaboratorService: CollaboratorService
    ) {

    }
    @Public()
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async signUp(
        @Body() collaboratorDto: CollaboratorDTO
    ) {
        return this.collaboratorService.createCollaborator(collaboratorDto)
    }

    @Public()
    @Post('/signin')
    @HttpCode(HttpStatus.CREATED)
    async signIn(
        @Body() authDto: AuthDto
    ) {
        return this.collaboratorService.login(authDto)
    }

    @ApiBearerAuth()
    @Get('/me')
    @HttpCode(HttpStatus.CREATED)
    async getUser(
        @GetCurrentUserId() userId: string
    ) {
        return this.collaboratorService.getUser(userId)
    }

    

}
