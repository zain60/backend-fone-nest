import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from '../../dtos/create-list.dto';
import { TenantAuthenticationGuard } from 'src/common/Guards/tenant-auth.guard';

@UseGuards(TenantAuthenticationGuard)
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  create(@Req() request: Request,@Body() createListDto: CreateListDto) {
    const tenantId = request['tenantId'];
    return this.listService.create(tenantId,createListDto);
  }

  @Get()
  findAll() {
    return this.listService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListDto) {
    return this.listService.update(id, updateListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listService.remove(id);
  }

  @Post('remove-by-name')
  removeAll(@Body() body: { listName: string }) {
    return this.listService.removeByName(body.listName)
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    console.log({name})
    return this.listService.findByName(name);
  }
}
