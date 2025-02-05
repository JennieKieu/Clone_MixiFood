import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Permission,
  PermissionModel,
} from './permissionSchemas/Permission.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: PermissionModel,
  ) {}
}
