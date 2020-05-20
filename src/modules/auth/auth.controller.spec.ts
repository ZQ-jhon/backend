import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

describe('Auth Controller', () => {
    let controller: AuthController;
    const service = {
        login: () => new User(),
        isUserExist: (user: User) => !!user,
        createUser: () => {
            const user = new User();
            delete user.password;
            return user;
        },
        signJWT: () => '',
        decodeJWT: () => {},
        refreshToken: () => '',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        })
            .overrideProvider(AuthService)
            .useValue(service)
            .compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
