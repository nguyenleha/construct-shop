export interface GetParamsPaginateDto {
  page: number;
  per_page: number;
  orderByField: string;
  order: 'ASC' | 'DESC';
}
