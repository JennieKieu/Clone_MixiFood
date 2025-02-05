import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtPayload } from 'src/auth/jwt.strategy';
import { RestaurantService } from 'src/restaunrantModule/restaurant.service';
import { ERoleName } from 'src/roleModule/roleSchemas/Role.schema';

@Injectable()
export class RestaurantRoleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private restaurantService: RestaurantService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    let decoded: jwtPayload = this.jwtService.verify(token);

    const restaurant = await this.restaurantService.findOneById(decoded.sub);

    if (!restaurant) throw new NotFoundException('Restaurant not found');
    // fix restaurant.role.roleName -> undifined
    // console.log(restauran.);

    if (restaurant.role !== ERoleName.restaurant)
      throw new UnauthorizedException('Permission denied');
    if (!restaurant.isActived)
      throw new UnauthorizedException('Restaurant not active');

    return true;
  }
}
