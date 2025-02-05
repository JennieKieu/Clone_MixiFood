import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ERestaurantRoleName,
  RestaurantRole,
  RestaurantRoleModel,
} from './shemas/restaurantRole.schema';
import { Types } from 'mongoose';

@Injectable()
export class RestaurantRoleService {
  constructor(
    @InjectModel(RestaurantRole.name)
    private restaurantRoleModel: RestaurantRoleModel,
  ) {}

  // async onModuleInit(restaurantId: string) {
  //   await this.createDefaultRestaurantRolesIfNotExists(restaurantId);
  // }

  //
  async createDefaultRestaurantRolesIfNotExists(restaurantId: Types.ObjectId) {
    const roles = [
      ERestaurantRoleName.manage,
      ERestaurantRoleName.security,
      ERestaurantRoleName.serve,
    ];

    for (const roleName of roles) {
      // const existingRole = await this.restaurantRoleModel.findOne({ roleName });
      // if (!existingRole) {
      const role = new this.restaurantRoleModel({
        roleName,
        restaurant: restaurantId,
        permissions: [],
      });
      await role.save();
      console.log(`Default ${roleName} role created`);
    }
    // else {
    //   console.log();s
    // }
    // }
  }

  async addEmployeeRole(
    restaurantId: string,
    roleName: ERestaurantRoleName,
    employeeId: Types.ObjectId,
  ) {
    const restaurantRole = await this.restaurantRoleModel
      .findOne({
        restaurant: new Types.ObjectId(restaurantId),
        roleName: roleName,
      })
      .exec();
    console.log('ress', restaurantRole);

    if (!restaurantRole) {
      throw new NotFoundException('Role not found for the restaurant');
    }

    if (!restaurantRole.employees.includes(employeeId))
      restaurantRole.employees = [...restaurantRole.employees, employeeId];

    return await restaurantRole.save();
  }

  // delete role
  async removeEmployeeRoles(restaurantId: string, employeeIds: string[]) {
    const roles = await this.restaurantRoleModel.find({
      restaurant: new Types.ObjectId(restaurantId),
    });
    // console.log(roles);

    for (const role of roles) {
      const employeesToRemove = role.employees.filter((employeeId) =>
        employeeIds.includes(employeeId.toString()),
      );

      if (employeesToRemove.length > 0) {
        console.log(
          `Removing employees: ${employeesToRemove} from role: ${role._id}`,
        );
        role.employees = role.employees.filter(
          (employeeId) => !employeeIds.includes(employeeId.toString()),
        );
        const updatedRole = await role.save();
        console.log(`Updated role: ${updatedRole}`);
      } else {
        // console.log(`No employees found for role: ${role._id}`);
      }
    }
  }
}
