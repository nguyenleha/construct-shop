import { GetParamsPaginateDto } from 'src/interfaces/common.interface';

export interface GetParamsMediaDto extends GetParamsPaginateDto {
  name?: string;
}
