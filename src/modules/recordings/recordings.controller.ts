import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { TenantAuthenticationGuard } from 'src/Guards/tenant-auth.guard';

@UseGuards(TenantAuthenticationGuard)
@Controller('recordings')
export class RecordingsController {
  constructor(private readonly recordingsService: RecordingsService) {
  }
  @Post()
  create(@Req()request: Request ,@Body() createRecordingDto: CreateRecordingDto) {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return this.recordingsService.create(tenandId,createRecordingDto);
  }

  @Get()
  findAll() {
    return this.recordingsService.findAll();
  }

  @Get(':id')
  findByUserId(@Param('id') id: string) {
    return this.recordingsService.findByUserId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() CreateRecordingDto) {
    return this.recordingsService.update(id, CreateRecordingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordingsService.delete(id);
  }
}
