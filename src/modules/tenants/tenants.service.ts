import { BadRequestException, Injectable } from '@nestjs/common';
import {  InjectModel } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { Tenant } from '../../schemas/tenant.schema';
import { AuthService } from 'src/modules/auth/auth.service';
import CreateCompanyDto from '../../dtos/create-company.dto';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) 
    private tenantModel: Model<Tenant>,
    private authService: AuthService,
  ) {}
  
  async getTenantById(tenantId: string) {
    return await this.tenantModel.findOne({ tenantId });
  }

  async createCompany(companyData: CreateCompanyDto) {
    const { companyName } = companyData;
    const companyExsist = await this.getCompanyByName(companyName);
    if (companyExsist) {
      throw new BadRequestException('This company is already registered as a tenant');
    }
    const tenantId =  uuidv4();
    await this.authService.createSecretKeyForNewTenant(tenantId);
    
    const data = await this.tenantModel.create({
      companyName:companyName,
      tenantId:tenantId
    });

    return {
      data: data,
      message: "Company created successfully"
    }
  }

  async getCompanyByName(companyName: string) {
    const data =  await this.tenantModel.findOne({ companyName });
   return data;
  }
}


