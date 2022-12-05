import { User } from '.prisma/client';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get('me')
    getMe(@GetUser('') user: User) {
        return user;
    }

    @Patch()
    editUser(@Body() dto: EditUserDto, @GetUser('id') userId: number){
        return this.userService.editUser(userId, dto)
    }
}
