import { IsString, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;
}
