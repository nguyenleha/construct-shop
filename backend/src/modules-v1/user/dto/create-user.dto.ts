import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty({ message: 'Age không được để trống' })
  age: number;

  @IsString()
  @IsNotEmpty({ message: 'Gender không được để trống' })
  gender: string;

  @IsString()
  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'role không được để trống' })
  role: string;
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Sai định dạng email' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Age không được để trống' })
  age: number;

  @IsString()
  @IsNotEmpty({ message: 'Gender không được để trống' })
  gender: string;

  @IsString()
  @IsNotEmpty({ message: 'Address không được để trống' })
  address: string;
}
