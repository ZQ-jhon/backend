import { Body, Controller, Get, HttpCode, Param, Post, Query, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Faliure } from 'src/interfaces/success.interface';
import { v4 } from 'uuid';

@Controller('user')
export class UserController {
    private buildfailureResponse = (code: number, msg: string) => ({ error: code, message: msg }) as Faliure<string>;

    constructor(
        private readonly userService: UserService,
    ) { }

    /**
     * 创建 User
     */
    @Post()
    @HttpCode(201)
    public async save(@Body() dto: User) {
        if (!dto.id) { dto.id = v4(); }
        try {
            return await this.userService.save(dto);
        } catch (err) {
            console.log(err);
            throw new BadRequestException(this.buildfailureResponse(402, 'POST 凭据字段不全，应该有 username 以及 password'));
        }
    }


    /**
     * 根据 分页参数/userId/username 查 User
     */
    @Get()
    public async getUserByQuery(@Query() query: { offset: number; limit: number; userId?: string }) {
        if (query.userId && !query.offset && !query.limit) {
            const user =  await this.userService.findOne(query.userId);
            return user;
        }
        if (!query.userId && query.offset && query.limit) {
            return await this.userService.findByOffsetAndLimit(query.offset, query.limit);
        }
        return await this.userService.findByOffsetAndLimit();
    }
}
