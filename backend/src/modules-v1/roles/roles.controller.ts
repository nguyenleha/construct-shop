import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  CreatePageDto,
  CreatePermissionDto,
  CreateRoleDto,
} from './dto/create-role.dto';
import {
  UpdatePageDto,
  UpdatePermissionDto,
  UpdateRoleDto,
} from './dto/update-role.dto';
import { RolesService } from './service/roles.service';
import { PermissionService } from './service/permission.service';
import { PageService } from './service/page.service';
import { Roles } from 'src/common/decorators/role';
import { APP_CONFIG } from 'src/config/app.config';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly pageService: PageService,
    private readonly rolesService: RolesService,
  ) {}

  // =========== Permission ===========

  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Permissions,
    permission: APP_CONFIG().permissions.Read,
  })
  @Get('permission')
  findAllPermission() {
    return this.permissionService.findAllPermission();
  }

  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Permissions,
    permission: APP_CONFIG().permissions.Created,
  })
  @Post('permission')
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.createPermission(createPermissionDto);
  }

  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Permissions,
    permission: APP_CONFIG().permissions.Updated,
  })
  @Patch('permission/:id')
  updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.updatePermission(+id, updatePermissionDto);
  }
  // ====================================================
  //====================PAGES=============================
  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Pages,
    permission: APP_CONFIG().permissions.Read,
  })
  @Get('page')
  findAllPage() {
    return this.pageService.findAllPage();
  }

  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Pages,
    permission: APP_CONFIG().permissions.Created,
  })
  @Post('page')
  createPage(@Body() createPageDto: CreatePageDto) {
    return this.pageService.createPage(createPageDto);
  }

  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Pages,
    permission: APP_CONFIG().permissions.Updated,
  })
  @Patch('page/:id')
  updatePage(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.updatePage(+id, updatePageDto);
  }

  // ======================ROLE==============

  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Roles,
    permission: APP_CONFIG().permissions.Created,
  })
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Roles,
    permission: APP_CONFIG().permissions.Read,
  })
  @Get()
  findAllRole() {
    return this.rolesService.findAllRole();
  }

  @UseGuards(RolesGuard)
  @Roles({
    page: APP_CONFIG().pages.Roles,
    permission: APP_CONFIG().permissions.Updated,
  })
  @Patch(':id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(+id, updateRoleDto);
  }
}
