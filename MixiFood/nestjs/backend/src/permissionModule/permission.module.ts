import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, permissionSchema } from './permissionSchemas/Permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: permissionSchema,
      },
    ]),
  ],
  providers: [],
})
export class PermissionModule {}
