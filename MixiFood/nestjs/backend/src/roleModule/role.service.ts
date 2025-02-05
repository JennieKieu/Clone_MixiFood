import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ERoleName, Role, RoleModel } from './roleSchemas/Role.schema';

// console.log(ERoleName.admin);

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: RoleModel) {}

  async onModuleInit() {
    await this.createDefaultRolesIfNotExists();
  }

  private async createDefaultRolesIfNotExists() {
    const roles = [ERoleName.admin, ERoleName.user, ERoleName.restaurant, ERoleName.employee];

    for (const roleName of roles) {
      const existingRole = await this.roleModel.findOne({ roleName });
      if (!existingRole) {
        const role = new this.roleModel({
          roleName,
          permissions: [],
        });
        await role.save();
        console.log(`Default ${roleName} role created`);
      } else {
        console.log();
      }
    }
  }
}
