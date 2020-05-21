import { IsString } from "class-validator";

export class CommentDto {
    @IsString()
    public userId: string;
    @IsString()
    public content: string;
}