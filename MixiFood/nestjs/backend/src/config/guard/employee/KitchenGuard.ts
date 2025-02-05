import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from 'src/auth/jwt.strategy';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { ERestaurantRoleName } from 'src/restaunrantModule/restaurrantRoleModule/shemas/restaurantRole.schema';

@Injectable()
export class KitchenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private employeeService: EmployeeService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('Authorization header not found');
      }

      const token = authHeader.split(' ')[1];
      let decoded: jwtPayload = this.jwtService.verify(token);

      const employee = await this.employeeService.findOneById(decoded.sub);
      if (!employee) throw new NotFoundException('Restaurant not found');

      /*
        bug: employee.restaurantRole ===  ERestaurantRoleName 
        employee.restaurantRole.roleName === undified
        */

      if (
        !employee.restaurantRole ||
        employee.restaurantRole.roleName === ERestaurantRoleName.serve ||
        employee.restaurantRole.roleName === ERestaurantRoleName.security
      ) {
        throw new UnauthorizedException('Permission denied');
      }
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Permission denied');
    }
  }
}
