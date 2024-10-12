import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Match } from 'src/common/decorators/validatorMatch';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Sai định dạng email' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm Password không được để trống' })
  @Match('password', {
    message: 'Password và Confirm Password phải trùng nhau',
  })
  confirmPassword: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Age không được để trống' })
  age: number;

  @IsString()
  @IsNotEmpty({ message: 'Gender không được để trống' })
  gender: string;

  @IsString()
  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds?: number[];
}


