import { GetParamsPaginateDto } from 'src/interfaces/common.interface';

export interface GetParamsCategoryDto extends GetParamsPaginateDto {
    name?: string;
    status?: string
}