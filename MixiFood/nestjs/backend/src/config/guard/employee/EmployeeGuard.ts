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
import { EmployeeService } from 'src/EmployeeModule/employee.service';

@Injectable()
export class EmployeeGuard implements CanActivate {
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

      if (!employee.restaurantRole) {
        throw new UnauthorizedException('Permission denied');
      }

      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Permission denied');
    }
  }
}
