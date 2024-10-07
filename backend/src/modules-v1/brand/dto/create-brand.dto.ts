import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Media không được để trống' })
    mediaId: number;
}
