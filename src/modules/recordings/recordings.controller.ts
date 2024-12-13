import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { TenantAuthenticationGuard } from 'src/common/Guards/tenant-auth.guard';
import { PermissionGuard } from 'src/common/Guards/permission.guard';
import { Action } from '../roles/enums/action.enum';

import { Permissions } from '../../common/decorators/permissions.decorator';
import { Resource } from '../roles/enums/resource.enum';

@UseGuards(TenantAuthenticationGuard, PermissionGuard)
@Controller('recordings')
export class RecordingsController {
  constructor(private readonly recordingsService: RecordingsService) {
  }

  @Permissions([
    {
      resource: Resource.recordings,
      actions: [Action.create]
    }
  ])
  @Post()
  create(@Req() request: Request, @Body() createRecordingDto: CreateRecordingDto) {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return this.recordingsService.create(tenandId, createRecordingDto);
  }


  @Permissions([
    {
      resource: Resource.recordings,
      actions: [Action.read]
    }
  ])
  @Get()
  findAll() {
    return this.recordingsService.findAll();
  }

  @Permissions([
    {
      resource: Resource.recordings,
      actions: [Action.read]
    }
  ])
  @Get(':id')
  findByUserId(@Param('id') id: string) {
    return this.recordingsService.findByUserId(id);
  }

  @Permissions([
    {
      resource: Resource.recordings,
      actions: [Action.update]
    }
  ])
  @Patch(':id')
  update(@Param('id') id: string, @Body() CreateRecordingDto) {
    return this.recordingsService.update(id, CreateRecordingDto);
  }

  @Permissions([
    {
      resource: Resource.recordings,
      actions: [Action.delete]
    }
  ])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordingsService.delete(id);
  }
}
