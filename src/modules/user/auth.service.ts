import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Success } from "src/interfaces/success.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  public signJWT(username: string, userId: string) {
    // 10 min
    return this.jwtService.sign({ username, userId }, { algorithm: 'HS256', expiresIn: '1day' });
  }
  public decodeJWT(token: string) {
    return this.jwtService.decode(token);
  }
  public verifyJWT(token: string) {
    const [tokenType, _token] = token.split(' ');
    return this.jwtService.verifyAsync(_token);
  }
}