import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';

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
