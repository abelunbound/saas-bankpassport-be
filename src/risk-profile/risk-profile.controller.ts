import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RiskProfileService } from './risk-profile.service';
import { FileUploadDto, MonoRiskProfileDTO, RiskAnalysisProjectDTO, RiskProfileDto } from './dto/risk-profile.dto';
import { Response, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { Public } from 'src/decorators/public-decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('risk-profile')
export class RiskProfileController {
    constructor(
        private riskProfileService: RiskProfileService
    ) { }

    @ApiBearerAuth()
    @Get("/")
    @HttpCode(HttpStatus.OK)
    async getAllRiskProfiles() {
        return await this.riskProfileService.getAllRiskProfile()
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
    ) {
        return await this.riskProfileService.getAllRiskProfile()
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
    @Patch("/:id")
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
