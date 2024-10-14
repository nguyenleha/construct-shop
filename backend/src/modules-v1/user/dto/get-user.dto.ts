import { GetParamsPaginateDto } from 'src/interfaces/common.interface';

export interface GetParamsUserDto extends GetParamsPaginateDto {
  name?: string;
  email?: string;
  age?: number;
  gender?: string;
  address?: string;
  isActive?: boolean;

}
