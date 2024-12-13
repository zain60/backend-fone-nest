import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDto } from './dtos/contact.dto';
import { TenantAuthenticationGuard } from 'src/common/Guards/tenant-auth.guard';
import { BulkContactDto } from './dtos/bulk-contact.sto';
import { PermissionGuard } from 'src/common/Guards/permission.guard';
import { Action } from '../roles/enums/action.enum';

import { Permissions } from '../../common/decorators/permissions.decorator';
import { Resource } from '../roles/enums/resource.enum';

@UseGuards(TenantAuthenticationGuard, PermissionGuard)
@Controller('contacts')

export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }
  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.read]
    }
  ])
  @Get()
  async findAll() {
    return this.contactsService.findAll();
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.read]
    }
  ])
  @Get('user/:id')
  async findByUserId(@Param('id') id: string) {
    return this.contactsService.findByUserId(id);
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.read]
    }
  ])
  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.read]
    }
  ])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.create]
    }
  ])
  @Post()
  async create(@Req() request: Request, @Body() contactData: ContactDto) {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return this.contactsService.create(contactData, tenandId);
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.create]
    }
  ])
  @Post('bulk-import')
  async bulkImport(@Req() request: Request, @Body() contactData: BulkContactDto) {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return this.contactsService.bulkCreate(contactData, tenandId);
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.update]
    }
  ])
  @Put(':id')
  async update(@Param('id') id: string, @Body() contactData: ContactDto) {
    return this.contactsService.update(id, contactData);
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.delete]
    }
  ])
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contactsService.delete(id);
  }

}
