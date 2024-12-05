import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDto } from './dtos/contact.dto';
import { TenantAuthenticationGuard } from 'src/Guards/tenant-auth.guard';
@UseGuards(TenantAuthenticationGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {
    console.log('ContactsController constructor');
  }

  @Get()
    async findAll() {
      return this.contactsService.findAll();
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
  
     @Put(':id')
     async update(@Param('id') id: string, @Body() contactData: ContactDto) {
      return this.contactsService.update(id, contactData);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.contactsService.delete(id);
    }
  
}
