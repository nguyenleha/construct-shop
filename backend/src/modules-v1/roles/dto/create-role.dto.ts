import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Email không được để trống' })
  name: string;
}
// Kế thừa trực tiếp mà không làm cho thuộc tính "name" trở thành tùy chọn
export class CreatePageDto extends CreatePermissionDto {
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}

export class CreateRoleDto extends CreatePermissionDto {
  @IsArray()
  @IsNumber({}, { each: true })
  pageIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  permissionIds: number[][];
}
