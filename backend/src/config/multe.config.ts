import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter: (req, file, cb) => {
        // Allowed file types
        const allowedTypes = /jpg|jpeg|png|text\/plain|application\/pdf/;
        const mimeType = allowedTypes.test(file.mimetype);
        if (!mimeType) {
          return cb(
            new UnsupportedMediaTypeException('Loại file không hợp lệ'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize:
          this.configService.get<number>('LIMIT_FILE_SIZE') || 1024 * 1024, // 1MB
      },
      storage: memoryStorage(),
    };
  }
}
