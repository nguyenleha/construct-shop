import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Email không được để trống' })
  name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  pageIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  permissionIds: number[][];
}
