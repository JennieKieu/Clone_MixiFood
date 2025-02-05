import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from 'src/auth/jwt.strategy';
import { UserType } from 'src/auth/userAuth/login-auth.dto';
import { RestaurantService } from 'src/restaunrantModule/restaurant.service';
import { UserService } from 'src/userModule/user.service';

@Injectable()
export class SmsOtpGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private restaurantService: RestaurantService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request.headers.authorization);

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    const token = authHeader.split(' ')[1];
    const decoded: jwtPayload = this.jwtService.verify(token);

    const user =
      decoded.userType === UserType.User
        ? await this.userService.findOneByPhoneNumber(request.body.phoneNumber)
        : await this.restaurantService.findOneByPhoneNumber(
            request.body.phoneNumber,
          );

    // console.log('us', user);

    if (!user) throw new NotFoundException('User not found');
    if (decoded.sub !== user._id.toString()) {
      throw new NotFoundException('Unauthorized access');
    }

    return true;
  }
}
