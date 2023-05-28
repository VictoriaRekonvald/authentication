import { Body, Controller, Delete, Get, Param, Post, Put, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user/user';
import { UpdateUser } from './dto/user/update-user';
import { UserExceptionFilter } from './filter/user/user.filter';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): UserDto[] {
    return this.userService.findAll();
  }

  @Post()
  @UseFilters(UserExceptionFilter)
  create(@Body() user: UserDto): UserDto {
    return this.userService.create(user);
  }

  @Put(':id')
  @UseFilters(UserExceptionFilter)
  update(@Param('id') id: string, @Body() updateUser: UpdateUser): UserDto {
    return this.userService.update(id, updateUser);
  }

  @Delete(':id')
  @UseFilters(UserExceptionFilter)
  remove(@Param('id') id: string): void {
    this.userService.remove(id);
  }
}
