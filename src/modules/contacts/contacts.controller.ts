import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDto } from './dtos/contact.dto';
import { TenantAuthenticationGuard } from 'src/Guards/tenant-auth.guard';
import { BulkContactDto } from './dtos/bulk-contact.sto';
@UseGuards(TenantAuthenticationGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {  }

  @Get()
    async findAll() {
      return this.contactsService.findAll();
    }

    @Get('user/:id')
    async findByUserId(@Param('id') id: string) {
      return this.contactsService.findByUserId(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.contactsService.findOne(id);
    }
  
    @Post()
    async create( @Req()request: Request, @Body() contactData: ContactDto) {
      const tenandId = request.headers['x-tenant-id']?.toString()
      return this.contactsService.create(contactData,tenandId);
    }

    @Post('bulk-import')
    async bulkImport( @Req()request: Request, @Body() contactData: BulkContactDto) {
      const tenandId = request.headers['x-tenant-id']?.toString()
      return this.contactsService.bulkCreate(contactData,tenandId);
    }
  
     @Put(':id')
     async update(@Param('id') id: string, @Body() contactData: ContactDto) {
      return this.contactsService.update(id, contactData);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.contactsService.delete(id);
    }

}
