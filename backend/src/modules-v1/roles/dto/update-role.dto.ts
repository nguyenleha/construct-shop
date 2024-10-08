import { PartialType } from '@nestjs/mapped-types';
import {
  CreatePageDto,
  CreatePermissionDto,
  CreateRoleDto,
} from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
export class UpdatePageDto extends PartialType(CreatePageDto) {}
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
