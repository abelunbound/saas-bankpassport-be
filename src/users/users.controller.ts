import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiProperty } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {

    }

    @ApiProperty()
    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    async deleteUser(
        @Param("id") id: number
    ) {
        return await this.userService.deleteUser(id)
    }
}
