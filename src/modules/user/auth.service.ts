import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

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
    return this.jwtService.sign({ username, userId }, { algorithm: 'HS256', expiresIn: '1d' });
  }
  public decodeJWT(token: string) {
    return this.jwtService.decode(token);
  }

  public refreshToken(token: string) {
    const { username, userId } = this.decodeJWT(token) as { username: string, userId: string };
    try {
      this.jwtService.verify(token);
      return token;
    } catch (err) {
      return this.signJWT(username, userId);
    }
  }
}