import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetParamsMediaDto } from './dto/get-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ResponseMessage('Upload hình thành công')
  @UseInterceptors(FilesInterceptor('image'))
  create1(@UploadedFiles() images: Express.Multer.File[]) {
    return this.mediaService.create(images);
  }

  @Get()
  findAll(@Query() qs: GetParamsMediaDto) {
    return this.mediaService.findAll(qs);
  }
}
