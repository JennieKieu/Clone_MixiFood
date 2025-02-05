import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserType } from 'src/auth/userAuth/login-auth.dto';

export class BaseDto {
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  
  static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
