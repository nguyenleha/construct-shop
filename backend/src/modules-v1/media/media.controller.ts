import { Controller, Body, Get } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { ResponseMessage } from 'src/common/decorators/responseMessage';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ResponseMessage('Test message')
  @Get()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }
}
