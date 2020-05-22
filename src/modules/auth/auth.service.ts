import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { createHmac } from 'crypto';
import { isNil } from 'lodash';
import { defer, from, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { UserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }
    /**
     * matchOneByPayload
     */
    public async login(payload: { username: string; password: string }) {
        const user = await this.findOne(payload.username).toPromise();
        if (isNil(user)) {
            return throwError(new HttpException(`User ${payload.username} is not exist!`, HttpStatus.FORBIDDEN)).toPromise();
        }
        // TODO: MIXIN PASSWORD VERIFY
        const promise = this.userRepository
            .createQueryBuilder('user')
            .where(`user.password = :pwd AND user.username = :username`, {
                pwd: payload.password,
                username: payload.username,
            })
            .select(['user.username', 'user.id', 'user.createdAt'])
            .getOne();
        return from(promise).pipe(
            tap(u => console.log(u)),
            switchMap(u => (!!u ? of(u) : throwError(new HttpException('Authorization failed!', HttpStatus.FORBIDDEN))))
        ).toPromise();
    }

    public findOne(username: string) {
        return from(
            this.userRepository
                .createQueryBuilder('user')
                .where('user.username = :name', { name: username })
                .getOne()
        );
    }

    public createUser(userDTO: UserDto) {
        const user = plainToClass(User, userDTO);
        this.crypto(user);
        const save$ = defer(() =>
            from(this.userRepository.save(user)).pipe(
                map(user => {
                    delete user.password;
                    return user as Omit<User, 'password'>;
                })
            )
        );
        const error$ = of(new HttpException('用户已存在', HttpStatus.BAD_REQUEST));
        return this.findOne(user.username).pipe(switchMap(user => (isNil(user) ? error$ : save$)));
    }

    public signJWT(username: string, userId: string) {
        // 10 min
        // {
        //   "id": "9ssss",
        //   "iat": 1587918733,
        //   "exp": 1588523533,
        //   "aud": "username",
        //   "iss": "Micro-Service-Name",
        //   "sub": "from-application"
        // }
        return this.jwtService.sign({ username, userId }, { algorithm: 'HS256', expiresIn: '24h' });
    }
    public decodeJWT(token: string) {
        return this.jwtService.decode(token);
    }

    public refreshToken(token: string) {
        if (isNil(this.decodeJWT(token))) {
            throw new BadRequestException('Token format error, check and confirm your token is full again!');
        }
        const { username, userId } = this.decodeJWT(token) as { username: string; userId: string };
        try {
            this.jwtService.verify(token);
            return token;
        } catch (err) {
            return this.signJWT(username, userId);
        }
    }


    private crypto(user: User) {
        if (!user.password) { return; }
        const algorithm = 'sha256';
        const secret = v4();
        const mixinPassword = createHmac(algorithm, secret)
            .update(user.password + secret)
            .digest('base64');
        user.algorithm = algorithm;
        user.password = mixinPassword;
        user.secret = secret;
        return user;
    }
}
