import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Media } from '../media/entities/media.entity';
import { PaginationService } from 'src/common/utils/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Media])],
  controllers: [BrandController],
  providers: [BrandService, PaginationService],
})
export class BrandModule { }
