// import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import {
//   MulterOptionsFactory,
//   MulterModuleOptions,
// } from '@nestjs/platform-express';
// import { memoryStorage } from 'multer';

// @Injectable()
// export class MulterConfigService implements MulterOptionsFactory {
//   constructor(private configService: ConfigService) {}

//   createMulterOptions(): MulterModuleOptions {
//     return {
//       fileFilter: (req, file, cb) => {
//         // Allowed file types
//         const allowedTypes = /jpg|jpeg|png|text\/plain|application\/pdf/;
//         const mimeType = allowedTypes.test(file.mimetype);
//         if (!mimeType) {
//           return cb(
//             new UnsupportedMediaTypeException('Loại file không hợp lệ'),
//             false,
//           );
//         }
//         cb(null, true);
//       },
//       limits: {
//         fileSize:
//           this.configService.get<number>('LIMIT_FILE_SIZE') || 1024 * 1024, // 1MB
//       },
//       storage: memoryStorage(),
//     };
//   }
// }
import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => {
    return process.cwd();
  };

  ensureExits(targetDirectory: string) {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory successfully created, or it already');
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          break;
        case 'ENOTDIR':
          break;
        default:
          console.log(error);
          break;
      }
    });
  }
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'default';
          this.ensureExits(`public/images/${folder}`);
          cb(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        filename: (req, file, cb) => {
          //get image extension
          let extName = path.extname(file.originalname);

          //get Image's name(without extension)
          let baseName = path.basename(file.originalname, extName);

          let finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
    };
  }
}
