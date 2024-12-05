import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { TenantAuthenticationGuard } from 'src/Guards/tenant-auth.guard';

@UseGuards(TenantAuthenticationGuard)
@Controller('recordings')
export class RecordingsController {
  constructor(private readonly recordingsService: RecordingsService) {}
  @Post()
  create(@Body() createRecordingDto: CreateRecordingDto) {
    return this.recordingsService.create(createRecordingDto);
  }

  @Get()
  findAll() {
    return this.recordingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordingDto) {
    return this.recordingsService.update(+id, updateRecordingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordingsService.remove(+id);
  }
}
