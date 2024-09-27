import { ConfigService } from '@nestjs/config';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PaginationResponse } from 'src/interfaces/common.interface';
import { SelectQueryBuilder } from 'typeorm';

export class PaginationService {
  constructor() {}

  async paginateEntity<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page?: number,
    per_page?: number,
    routePath: string = '/api/v1/entity',
    configService: ConfigService = new ConfigService(),
  ): Promise<PaginationResponse<T>> {
    if (page && per_page) {
      const domain = configService.get<string>('DOMAIN_API');
      const port = configService.get<number>('PORT_API');
      const options: IPaginationOptions = {
        page,
        limit: per_page,
        route: `${domain}${port ? `:${port}` : ''}${routePath}`,
      };

      const { items, meta, links } = await paginate<T>(queryBuilder, options);

      const from = (page - 1) * per_page + 1;
      const to = Math.min(page * per_page, meta.totalItems);

      return {
        response: { count: items.length, media_list: items },
        meta: { ...meta, from, to },
        links,
      };
    } else {
      const items = await queryBuilder.getMany();

      return {
        response: { count: items.length, media_list: items },
        meta: {
          totalItems: items.length,
          totalPages: 1,
          currentPage: 1,
          from: 1,
          to: items.length,
          itemCount: 0,
          itemsPerPage: 0,
        },
      };
    }
  }
}
