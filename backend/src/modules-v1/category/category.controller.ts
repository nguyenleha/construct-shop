import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from 'src/common/decorators/public';
import { IUser } from 'src/interfaces/common.interface';
import { GetParamsCategoryDto } from './dto/get-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @User() user: IUser) {
    return this.categoryService.create(createCategoryDto, user);
  }

  @Get()
  findAll(@Query() qs: GetParamsCategoryDto) {
    return this.categoryService.findAll(qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @User() user: IUser) {
    return this.categoryService.update(+id, updateCategoryDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.categoryService.remove(+id, user);
  }
}
