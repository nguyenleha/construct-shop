import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePageDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  name: string;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean = true;
}
