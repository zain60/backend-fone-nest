import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import {  InjectModel } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { Tenant } from './schemas/tenant.schema';
import { AuthService } from 'src/auth/auth.service';
import CreateCompanyDto from './dto/create-company.dto';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) 
    private tenantModel: Model<Tenant>,
    private userService:UsersService,
    private authService: AuthService,
  ) {}
  
  async getTenantById(Id: string) {
    let tenantId = Id;
    return await this.tenantModel.findOne({ tenantId });

  }

  async createCompany(companyData: CreateCompanyDto) {
    const { companyName, user } = companyData;
    const userExsist = await this.userService.getUsersByEmail(user.email);
    if (userExsist) {
      throw new BadRequestException('User already exists');
    }
    const tenantId =  uuidv4();
    await this.authService.createSecretKeyForNewTenant(tenantId);
    
    await this.userService.createUser(user,tenantId);

    return this.tenantModel.create({
      companyName:companyName,
      tenantId:tenantId
    });
  }

}
