import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common'
import { User } from './user.entity'
import { UserService } from './user.service'
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('save')
    @HttpCode(201)
    public async save(@Body() dto: User) {
        let message = ''
        await this.userService
            .save(dto)
            .then(() => {
                message = '注册成功'
            })
            .catch(e => {
                message = '注册失败'
            })
        return message
    }

    @Get()
    public async getUser(@Query() sort: { offset: number; limit: number }) {
        if (sort.offset && sort.limit) {
            return await this.userService.findAll(sort.offset, sort.limit)
        }
        return await this.userService.findAll()
    }

    @Get(':id')
    public async getUserById(@Param() id: number) {
        return await this.userService.findOne(id)
    }
}
