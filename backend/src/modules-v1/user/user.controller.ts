import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/interfaces/common.interface';
import { Public, User } from 'src/common/decorators/public';
import { GetParamsUserDto } from './dto/get-user.dto';

import { Roles } from 'src/common/decorators/role';
import { APP_CONFIG } from 'src/config/app.config';

@Roles({ page: APP_CONFIG().pages.Users })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles({ permission: APP_CONFIG().permissions.Created })
  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.userService.create(createUserDto, user);
  }

  @Roles({ permission: APP_CONFIG().permissions.Read })
  @Get()
  findAll(@Query() qs: GetParamsUserDto) {
    return this.userService.findAll(qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles({ permission: APP_CONFIG().permissions.Updated })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return this.userService.updateUser(+id, updateUserDto, user);
  }

  @Roles({ permission: APP_CONFIG().permissions.Deleted })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.userService.remove(+id, user);
  }
}
