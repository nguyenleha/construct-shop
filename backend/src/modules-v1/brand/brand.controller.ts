import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { GetParamsBrandDto } from './dto/get-brand.dto';
import { IUser } from 'src/interfaces/common.interface';
import { User } from 'src/common/decorators/public';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  create(@Body() createBrandDto: CreateBrandDto, @User() user: IUser) {
    return this.brandService.create(createBrandDto, user);
  }

  @Get()
  findAll(@Query() qs: GetParamsBrandDto) {
    return this.brandService.findAll(qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto, @User() user: IUser) {
    return this.brandService.update(+id, updateBrandDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.brandService.remove(+id, user);
  }
}
