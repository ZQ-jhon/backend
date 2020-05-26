import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { createHmac } from 'crypto';
import { isNil } from 'lodash';
import { defer, from, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { UserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly redisCacheService: RedisCacheService,
    ) {}
    /**
     * matchOneByPayload
     */
    public async login(username: string, originPWD: string) {
        const user = await this.findOne(username).toPromise();
        if (isNil(user)) {
            return throwError(new HttpException(`User ${username} is not exist!`, HttpStatus.NOT_FOUND)).toPromise();
        }
        const { password, secret, algorithm, id, createdAt } = user;
        if (password === this.encodeMixinPassword(algorithm, originPWD, secret)) {
            return {
                username,
                id,
                createdAt,
            } as Pick<User, 'id' | 'username' | 'createdAt'>;
        } else {
            return throwError(new UnauthorizedException(`User ${username} password is not right!`)).toPromise();
        }
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
        return this.findOne(user.username).pipe(switchMap(user => (!isNil(user) ? error$ : save$)));
    }

    public async signJWT(username: string, userId: string) {
        // 10 min
        // {
        //   "id": "9ssss",
        //   "iat": 1587918733,
        //   "exp": 1588523533,
        //   "aud": "username",
        //   "iss": "Micro-Service-Name",
        //   "sub": "from-application"
        // }
        const token =  this.jwtService.sign({ username, userId }, { algorithm: 'HS256', expiresIn: '24h' });
        try {
            await this.redisCacheService.set(token, userId, 24 * 60 * 60).toPromise();
            console.log(`Redis GET[${token}]: ${await this.redisCacheService.get(token).toPromise()}`);
        } catch(err) {
            console.log(err);
        }
        return token;

    }
    public decodeJWT(token: string) {
        return this.jwtService.decode(token);
    }

    public async refreshToken(token: string) {
        if (isNil(this.decodeJWT(token))) {
            throw new BadRequestException('Token format error, check and confirm your token is full again!');
        }
        const { username, userId } = this.decodeJWT(token) as { username: string; userId: string };
        try {
            this.jwtService.verify(token);
            return token;
        } catch (err) {
            return await this.signJWT(username, userId);
        }
    }

    private crypto(user: User) {
        if (!user.password) {
            return;
        }
        const algorithm = 'sha256';
        const secret = v4();
        const mixinPassword = this.encodeMixinPassword(algorithm, user.password, secret);
        user.algorithm = algorithm;
        user.password = mixinPassword;
        user.secret = secret;
        return user;
    }

    private encodeMixinPassword(algorithm: string, password: string, secret: string) {
        return createHmac(algorithm, secret)
            .update(password + secret)
            .digest('base64');
    }
}
