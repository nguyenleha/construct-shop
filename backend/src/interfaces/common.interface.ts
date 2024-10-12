import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { Role } from 'src/modules-v1/roles/entities/role.entity';

export interface GetParamsPaginateDto {
  page: number;
  per_page: number;
  orderByField: string;
  order: 'ASC' | 'DESC';
}

export interface PaginationResponse<T> {
  response: { count: number; media_list: T[] };
  meta: IPaginationMeta;
  links?: IPaginationLinks;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
}
export interface IPayloadJWT extends IUser {
  iat: number;
  exp: number;
  jti: string;
}
