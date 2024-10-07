import { GetParamsPaginateDto } from 'src/interfaces/common.interface';

export interface GetParamsBrandDto extends GetParamsPaginateDto {
  name?: string;
  mediaId?: number;
}