import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Media } from '../media/entities/media.entity';
import { CommonService } from 'src/common/utils/Common.service';
import { PaginationService } from 'src/common/utils/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Media])],
  controllers: [BrandController],
  providers: [BrandService, PaginationService, CommonService],
})
export class BrandModule { }
