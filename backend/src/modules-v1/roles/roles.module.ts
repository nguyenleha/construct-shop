import { Module } from '@nestjs/common';

import { RolesController } from './roles.controller';
import { RolesService } from './service/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Page } from './entities/page.entity';
import { Permission } from './entities/permission.entity';
import { RolePagePermissionRelation } from './entities/rolePagePermissionRelation.entity';
import { PageService } from './service/page.service';
import { PermissionService } from './service/permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Page,
      Permission,
      RolePagePermissionRelation,
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService, PageService, PermissionService],
  exports: [RolesService, PageService, PermissionService],
})
export class RolesModule {}
