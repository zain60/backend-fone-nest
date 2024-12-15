import { Inject, Injectable } from '@nestjs/common';
import { Contact } from '../../schemas/contacts.schema';
import { Model, Types } from 'mongoose';
import { ContactDto } from '../../dtos/contact.dto';
import { BulkContactDto } from '../../dtos/bulk-contact.dto';

@Injectable()
export class ContactsService {

  constructor(@Inject('CONTACT_MODEL') private contactModel: Model<Contact>) { }
  
  async findAll() {
   const data = await this.contactModel.find().exec();
   return {
    data:data,
    message:"Records received sucessfully"
   }
  }

  async findByUserId(userId: string) {
    const data = await  this.contactModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('user')
      .exec();
      return {
        data:data,
        message:"Records received sucessfully"
       }
  }

  async findOne(id: string) {
    const data =  await  this.contactModel.findById(id).exec();
    return {
      data:data,
      message:"Records received sucessfully"
     }
  }

  async create(contactData: ContactDto, tenantId: string) {
    const createdContact = new this.contactModel({
      ...contactData,
      tenantId,
      user: new Types.ObjectId(contactData.userId)
    });
    await createdContact.save();
    const data =  createdContact.populate('user');
    return {
      data:data,
      message:"Records received sucessfully"
     }
  }

  async bulkCreate(bulkData: BulkContactDto, tenantId: string) {
    const contactsToCreate = bulkData.contacts.map((contact: any) => ({
      ...contact,
      tenantId,
      user: new Types.ObjectId(bulkData.userId)
    }));

    const data = await this.contactModel.insertMany(contactsToCreate);
    return {
      data:data,
      message:"Records received sucessfully"
     }
  }

  async update(id: string, contactData: ContactDto) {
    const data = await  this.contactModel.findByIdAndUpdate(id, contactData, { new: true }).exec();
    return {
      data:data,
      message:"Records received sucessfully"
     }
  }

  async delete(id: string) {
    const data =  await this.contactModel.findByIdAndDelete(id).exec();
    return {
      data:data,
      message:"Records received sucessfully"
     }
  }

}




