import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TwlioNumbersService } from './twlio-numbers.service';
import { CreateTwlioNumberDto } from '../../dtos/create-twlio-number.dto';
import { TenantAuthenticationGuard } from 'src/common/Guards/tenant-auth.guard';

@UseGuards(TenantAuthenticationGuard)
@Controller('twlio-numbers')
export class TwlioNumbersController {
  constructor(private readonly twlioNumbersService: TwlioNumbersService) {}

  @Post()
  create(@Req() request: Request,@Body() createTwlioNumberDto: CreateTwlioNumberDto) {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return this.twlioNumbersService.create(tenandId,createTwlioNumberDto);
  }

  @Get()
  findAll() {
    return this.twlioNumbersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.twlioNumbersService.findOne(id);
  }

  @Get('/user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.twlioNumbersService.findByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTwlioNumberDto) {
    return this.twlioNumbersService.update(id, updateTwlioNumberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.twlioNumbersService.remove(id);
  }
}
