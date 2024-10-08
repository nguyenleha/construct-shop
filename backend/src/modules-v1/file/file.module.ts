import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/config/multe.config';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
})
export class FileModule {}
