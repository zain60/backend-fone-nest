import { Inject, Injectable } from '@nestjs/common';
import { Contact } from './schemas/contacts.schema';
import { Model, Types } from 'mongoose';
import { ContactDto } from './dtos/contact.dto';
import { BulkContactDto } from './dtos/bulk-contact.sto';

@Injectable()
export class ContactsService {

  constructor(@Inject('CONTACT_MODEL') private contactModel: Model<Contact>) { }
  
  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Contact[]> {
    return this.contactModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('user')
      .exec();
  }

  async findOne(id: string): Promise<Contact> {
    return this.contactModel.findById(id).populate('user').exec();
  }

  async create(contactData: ContactDto, tenantId: string): Promise<Contact> {
    const createdContact = new this.contactModel({
      ...contactData,
      tenantId,
      user: new Types.ObjectId(contactData.userId)
    });
    await createdContact.save();
    return createdContact.populate('user');
  }

  async bulkCreate(bulkData: BulkContactDto, tenantId: string): Promise<Contact[]> {
    const contactsToCreate = bulkData.contacts.map((contact: any) => ({
      ...contact,
      tenantId,
      user: new Types.ObjectId(bulkData.userId)
    }));

    await this.contactModel.insertMany(contactsToCreate);
    return contactsToCreate;
  }

  async update(id: string, contactData: ContactDto): Promise<Contact> {
    return this.contactModel.findByIdAndUpdate(id, contactData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.contactModel.findByIdAndDelete(id).exec();
  }

}




