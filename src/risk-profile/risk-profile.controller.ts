import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RiskProfileService } from './risk-profile.service';
import { FileUploadDto, MonoRiskProfileDTO, RiskAnalysisProjectDTO, RiskProfileDto } from './dto/risk-profile.dto';
import { Response, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { Public } from 'src/decorators/public-decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { IUserDto } from 'src/users/dto/users.dto';

@Controller('risk-profile')
export class RiskProfileController {
    constructor(
        private riskProfileService: RiskProfileService
    ) { }

    @ApiBearerAuth()
    @Get("/")
    @HttpCode(HttpStatus.OK)
    async getAllRiskProfiles(
        @GetCurrentUserId() userId: number
    ) {
        return await this.riskProfileService.getAllRiskProfile(userId)
    }

    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Batch Risk profile',
        type: RiskAnalysisProjectDTO,
    })
    @Post("/")
    @HttpCode(HttpStatus.OK)
    async createProfile(
        @Body() payload: RiskAnalysisProjectDTO,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /\/(vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-excel)$/
                })
                .build({
                    fileIsRequired: true,
                }),
        )
        file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
    ) {
        return await this.riskProfileService.createBatchRiskProfile(payload, file, userId)
    }

    @ApiBearerAuth()
    @Get("/all")
    @HttpCode(HttpStatus.OK)
    async getAllProfiles(
        @GetCurrentUserId() userId: number
    ) {
        return await this.riskProfileService.getAllRiskProfile(userId)
    }

    @Public()
    @Get("/public")
    @HttpCode(HttpStatus.OK)
    async getPublicAllProfiles(
        @Query("userId") userId: number
    ) {
        return await this.riskProfileService.getAllRiskProfile(userId)
    }

    @ApiBearerAuth()
    @Get("user/:id")
    @HttpCode(HttpStatus.OK)
    async getOneUser(
        @Param("id") id: number,
        @GetCurrentUserId() userId: number
    ) {
        return await this.riskProfileService.getOneEnterpriseUser(id, userId)
    }

    @Public()
    @Put("/public")
    @HttpCode(HttpStatus.OK)
    async createUser(
        @Body() payload: IUserDto,
        @Query() query: {
            profileId: number,
            expTime: string
        }
    ) {
        return await this.riskProfileService.createProfile(payload, query.profileId, query.expTime)
    }

    @ApiBearerAuth()
    @Post("/create")
    @HttpCode(HttpStatus.CREATED)
    async createRiskProfile(
        @Body() payload: RiskProfileDto,
        @GetCurrentUserId() userId: string
    ) {
        return await this.riskProfileService.createRiskProfile(payload, userId)
    }

    @ApiBearerAuth()
    @Post("edit/:id")
    @HttpCode(HttpStatus.CREATED)
    async updateRiskProfile(
        @Param("id") id: number,
        @Body() payload: RiskProfileDto,
        @GetCurrentUserId() userId: string
    ) {
        return await this.riskProfileService.updateRiskProfile(userId, id, payload as any)
    }


    @ApiBearerAuth()
    @Delete("/:id")
    @HttpCode(HttpStatus.CREATED)
    async deleteRiskProfile(
        @Param("id") id: number,
        @GetCurrentUserId() userId: string
    ) {
        return await this.riskProfileService.deleteRiskProfile(userId, id)
    }

    @Public()
    @Get('/tink-callback')
    @HttpCode(HttpStatus.OK)
    async tinkCallback(
        @Query() query: Record<string, string>,
        @Res() response: Response
    ) {
        await this.riskProfileService.tinkCallBack(query)
        response.send('OK')
    }

    @Public()
    @Post('/mono-callback')
    @HttpCode(HttpStatus.OK)
    async monoCallback(
        @Body() body: MonoRiskProfileDTO
    ) {
        return await this.riskProfileService.monoCallback(body)
    }


}
