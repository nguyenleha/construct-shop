import path from 'path';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';

export const addingFile = async (
  file: Express.Multer.File,
  folder: string,
  configService: ConfigService,
) => {
  const domain = configService.get<string>('DOMAIN_API');
  const port = configService.get<number>('PORT_API');
  const folderPath = path.join('public', 'images', folder);
  const finalName = `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`;
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
};
