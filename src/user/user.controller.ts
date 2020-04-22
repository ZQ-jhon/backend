import { Body, Controller, Get, HttpCode, Param, Post, Query, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Faliure } from 'src/interfaces/success.interface';
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
            try {
                return await this.userService.save(dto);
            } catch (err) {
                console.log(err);
                throw new BadRequestException(this.buildfailureResponse(402, 'POST 凭据字段不全，应该有 username 以及 password'));
            }
    }

    /**
     * 获取单个 User
     */
    @Get(':id')
    public async getUserById(@Param() id: number) {
        return await this.userService.findOne(id);
    }

    /**
     * 根据分页参数查 User
     */
    @Get()
    public async getUserByQuery(@Query() sort: { offset: number; limit: number }) {
        if (sort.offset && sort.limit) {
            return await this.userService.findByOffsetAndLimit(sort.offset, sort.limit);
        }
        return await this.userService.findByOffsetAndLimit();
    }
}
