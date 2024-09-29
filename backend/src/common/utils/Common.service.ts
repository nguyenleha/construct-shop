import path from 'path';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';

export class CommonService {
  constructor() {}
  removeKey(response: any) {
    delete response.password;
    delete response.isActive;
    delete response.isDeleted;
    delete response.deleted_at;
    delete response.refreshToken;
    return response;
  }

  removeKeyList(response: any) {
    const data = response.map((rest) => this.removeKey(rest));
    return data;
  }

  createFolderImageTrash() {
    const publicDir = path.resolve(__dirname, '../../../public');
    const trashDir = path.join(publicDir, 'trash', 'images', 'media');

    // Tạo thư mục trash nếu chưa tồn tại
    fs.mkdirSync(path.join(publicDir, 'trash'), { recursive: true });
    fs.mkdirSync(trashDir, { recursive: true });

    return { publicDir, trashDir };
  }
  async addingFile(
    file: Express.Multer.File,
    folder: string,
    configService: ConfigService = new ConfigService(),
    index?: number,
  ) {
    const domain = configService.get<string>('DOMAIN_API');
    const port = configService.get<number>('PORT_API');
    const folderPath = path.join('public', 'images', folder);
    const finalName = `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}${index ? index : ''}${path.extname(file.originalname)}`;
    const logoValue = `${domain}${port ? `:${port}` : ''}/images${folder}/${finalName}`;

    // Tạo thư mục nếu chưa tồn tại
    await fs.promises.mkdir(path.join(process.cwd(), folderPath), {
      recursive: true,
    });
    await fs.promises.writeFile(
      path.join(process.cwd(), folderPath, finalName),
      file.buffer,
    );

    return {
      name: file.originalname,
      image: `/images${folder}/${finalName}`,
      imageFullPath: logoValue,
    };
  }
}
