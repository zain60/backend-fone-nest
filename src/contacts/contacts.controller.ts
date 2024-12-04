import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDto } from './dtos/contact.dto';

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
    async create(@Body() contactData: ContactDto) {
      return this.contactsService.create(contactData);
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
