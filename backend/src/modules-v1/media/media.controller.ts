import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetParamsMediaDto } from './dto/get-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ResponseMessage('Upload hình thành công')
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() image: Express.Multer.File) {
    return this.mediaService.create(image);
  }

  @Get()
  findAll(@Query() qs: GetParamsMediaDto) {
    return this.mediaService.findAll(qs);
  }
}
