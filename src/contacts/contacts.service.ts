import { Inject, Injectable } from '@nestjs/common';
import { Contact } from './schemas/contacts.schema';
import { Model } from 'mongoose';
import { ContactDto } from './dtos/contact.dto';

@Injectable()
export class ContactsService {

    constructor(@Inject('CONTACT_MODEL') private contactModel: Model<Contact>) {}
    async  findAll(): Promise<Contact[]> {
        return this.contactModel.find().exec();
      }

      async findOne(id: string): Promise<Contact> {
        return this.contactModel.findById(id).exec();
      }

      async create( contactData: ContactDto,tenantId: string): Promise<Contact> {
        const createdContact = new this.contactModel({
          ...contactData,
          tenantId,
      });
        await createdContact.save();
        return createdContact;
      }

      async update(id: string, contactData: ContactDto): Promise<Contact> {
        return this.contactModel.findByIdAndUpdate(id, contactData, { new: true }).exec();
      }

      async delete(id: string): Promise<void> {
        await this.contactModel.findByIdAndDelete(id).exec();
      }


}




