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
   return{
    data,
    message:"Records recterived sucessfully"
   }
  }

  async findByNumber(number: string) {
    const data = await this.contactModel.findOne({ number }).exec();
    return {
      data:data,
      message:"Records reterived sucessfully"
     }
  }

  async findByUserId(userId: string) {
    const data = await this.contactModel.aggregate([
      {
        $match: { user: new Types.ObjectId(userId) } // Match all contacts for the given user
      },
      {
        $lookup: {
          from: 'lists', // List collection
          localField: 'listId',
          foreignField: '_id',
          as: 'listDetails'
        }
      },
      {
        $lookup: {
          from: 'users', // User collection
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          number: 1,
          listName: { $arrayElemAt: ['$listDetails.listName', 0] }, // Extract listName
          userName: { $arrayElemAt: ['$userDetails.name', 0] }, // Extract userName
          tenantId: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
  
    return {
      data: data,
      message: "Records retrieved successfully"
    };
  }
  
  async findOne(id: string) {
    const data =  await  this.contactModel.findById(id).exec();
    return {
      data:data,
      message:"Records reterived sucessfully"
     }
  }

  async create(contactData: ContactDto, tenantId: string) {
    const createdContact = new this.contactModel({
      ...contactData,
      tenantId,
      listId: new Types.ObjectId(contactData.listId),
      user: new Types.ObjectId(contactData.userId)
    });
    await createdContact.save();
    const data =  createdContact.populate('user');
    return {
      data:data,
      message:"Records created sucessfully"
     }
  }

  async bulkCreate(bulkData: BulkContactDto, tenantId: string) {
    const contactsToCreate = bulkData.contacts.map((contact: any) => ({
      ...contact,
      tenantId,
      listId: new Types.ObjectId(bulkData.contacts[0].listId),
      user: new Types.ObjectId(bulkData.userId)
    }));

    const data = await this.contactModel.insertMany(contactsToCreate);
    return {
      data:data,
      message:"Bulk Contracts importedd sucessfully"
     }
  }

  async update(id: string, contactData: ContactDto) {
    const data = await  this.contactModel.findByIdAndUpdate(id, {
      ...contactData,
      listId: new Types.ObjectId(contactData.listId),
      user: new Types.ObjectId(contactData.userId)
    }).exec();
    return {
      data:data,
      message:"contacts updated  sucessfully"
     }
  }

  async delete(id: string) {
    const data =  await this.contactModel.findByIdAndDelete(id).exec();
    return {
      data:data,
      message:"contacts deleted sucessfully"
     }
  }

}




