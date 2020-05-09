import { IsString } from 'class-validator';

export class UserDto {
    @IsString()
    public readonly username: string;
    @IsString()
    public readonly password: string;
}
