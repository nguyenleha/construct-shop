import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

@Controller('roles')
export class RolesController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly pageService: PageService,
    private readonly rolesService: RolesService,
  ) {}

  // =========== Permission ===========
  @Get('permission')
  findAllPermission() {
    return this.permissionService.findAllPermission();
  }

  @Post('permission')
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.createPermission(createPermissionDto);
  }

  @Patch('permission/:id')
  updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.updatePermission(+id, updatePermissionDto);
  }
  // ====================================================
  //====================PAGES=============================
  @Get('page')
  findAllPage() {
    return this.pageService.findAllPage();
  }

  @Post('page')
  createPage(@Body() createPageDto: CreatePageDto) {
    return this.pageService.createPage(createPageDto);
  }

  @Patch('page/:id')
  updatePage(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.updatePage(+id, updatePageDto);
  }

  // ======================

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
