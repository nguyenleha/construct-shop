import {
  Body,
  Controller,
  Delete,
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
import { User } from 'src/common/decorators/public';
import { IUser } from 'src/interfaces/common.interface';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ResponseMessage('Upload hình thành công')
  @UseInterceptors(FilesInterceptor('image'))
  create(@UploadedFiles() images: Express.Multer.File[], @User() user: IUser) {
    return this.mediaService.create(images, user);
  }

  @Get()
  findAll(@Query() qs: GetParamsMediaDto) {
    return this.mediaService.findAll(qs);
  }

  @Delete()
  moveToTrash(@Body('ids') ids: number[]) {
    return this.mediaService.moveToTrash(ids);
  }

  @Delete('emptyTrash')
  emptyTrash() {
    return this.mediaService.emptyTrash();
  }
}
