import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MulterConfigService } from 'src/config/multe.config';
import { MulterModule } from '@nestjs/platform-express';
import { PaginationService } from 'src/common/utils/pagination.service';
import { CommonService } from 'src/common/utils/Common.service';
import { Trash } from './entities/trash.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, Trash]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, PaginationService, CommonService],
})
export class MediaModule {}
