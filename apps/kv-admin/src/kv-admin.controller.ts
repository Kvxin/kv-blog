import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KvAdminService } from './kv-admin.service';
import { User } from './entities/user.entity';

@Controller('kv-admin')
export class KvAdminController {
  constructor(private readonly kvAdminService: KvAdminService) {}

  @Post()
  create(@Body() createUserDto: Partial<User>) {
    return this.kvAdminService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.kvAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kvAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
    return this.kvAdminService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kvAdminService.remove(+id);
  }
}
