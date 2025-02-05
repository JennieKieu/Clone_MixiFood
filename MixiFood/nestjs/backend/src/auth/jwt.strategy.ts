import { Injectable } from '@nestjs/common';
import { UserService } from 'src/userModule/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserType } from './userAuth/login-auth.dto';
import { RestaurantService } from 'src/restaunrantModule/restaurant.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';

export type jwtPayload = {
  sub: string;
  userType: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly restaurantService: RestaurantService,
    private readonly employeeService: EmployeeService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  async validate(payload: jwtPayload) {
    const { sub, userType } = payload;
    const user =
      userType === UserType.User
        ? await this.userService.findOneById(payload.sub)
        : userType === UserType.Restaurant
          ? await this.restaurantService.findOneById(payload.sub)
          : await this.employeeService.findOneById(payload.sub);
    return user;
  }
}
