import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDto } from '../../dtos/contact.dto';
import { TenantAuthenticationGuard } from 'src/common/Guards/tenant-auth.guard';
import { BulkContactDto } from '../../dtos/bulk-contact.dto';
import { PermissionGuard } from 'src/common/Guards/permission.guard';
import { Action } from '../../libs/utils/enums/action.enum';

import { Permissions } from '../../common/decorators/permissions.decorator';
import { Resource } from '../../libs/utils/enums/resource.enum';

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
  async findByUserId(@Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10) {
    return this.contactsService.findByUserId(id,page, limit);
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
      actions: [Action.read]
    }
  ])
  @Get('number/:number')
  async findByNumber(@Param('number') number: string) {
    return this.contactsService.findByNumber(number);
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.create]
    }
  ])
  @Post()
  async create(@Req() request: Request, @Body() contactData: ContactDto) {
    const tenantId = request['tenantId'];
    return this.contactsService.create(contactData, tenantId);
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.create]
    }
  ])
  @Post('bulk-import')
  async bulkImport(@Req() request: Request, @Body() contactData: BulkContactDto) {
    const tenantId = request['tenantId'];
    return this.contactsService.bulkCreate(contactData, tenantId);
  }

  @Permissions([
    {
      resource: Resource.contacts,
      actions: [Action.update]
    }
  ])
  @Put('update/:id')
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
