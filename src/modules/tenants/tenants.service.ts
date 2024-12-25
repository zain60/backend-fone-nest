import { BadRequestException, Injectable } from '@nestjs/common';
import {  InjectModel } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { Tenant } from '../../schemas/tenant.schema';
import { AuthService } from 'src/modules/auth/auth.service';
import CreateCompanyDto from '../../dtos/create-company.dto';
import { v4 as uuidv4 } from 'uuid';
import { CustomLogger } from 'src/common/logger/custom.logger';


@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) 
    private tenantModel: Model<Tenant>,
    private authService: AuthService,
  ) {}

  private readonly logger = new CustomLogger();
  


  async getTenantById(tenantId: string) {
    this.logger.log(`Fetching tenant with ID: ${tenantId}`, 'TenantsService');
    const tenant = await this.tenantModel.findOne({ tenantId });
    if (!tenant) {
      this.logger.error(`No tenant found with ID: ${tenantId}`, 'TenantsService');
    }
    return tenant;
  }

  async createCompany(companyData: CreateCompanyDto) {
    this.logger.log(`Attempting to create new company with domain: ${companyData.domain}`, 'TenantsService');
    
    const { domain } = companyData;
    const companyExists = await this.getTenantByDomain(domain);
    
    if (companyExists) {
      this.logger.warn(`Company creation failed - domain already exists: ${domain}`, 'TenantsService');
      throw new BadRequestException('This company/domain is already registered as a tenant');
    }

    const tenantId = uuidv4();
    try {
      await this.authService.createSecretKeyForNewTenant(tenantId);
      
      const newCompany = await this.tenantModel.create({
        ...companyData,
        tenantId: tenantId
      });

      this.logger.log(`Successfully created new company: ${companyData.companyName}`, 'TenantsService');
      
      return {
        data: newCompany,
        message: "Company created successfully"
      };
    } catch (error) {
      this.logger.error(
        `Failed to create company: ${companyData.companyName}`,
        error.stack,
        'TenantsService'
      );
      throw error;
    }
  }


  async getTenantByDomain(domain: string) {
    this.logger.log(`Searching for tenant with domain: ${domain}`, 'TenantsService');
    const tenant = await this.tenantModel.findOne({ domain });
    
    if (!tenant) {
      this.logger.warn(`No tenant found for domain: ${domain}`, 'TenantsService');
    } else {
      this.logger.log(`Found tenant for domain: ${domain}`, 'TenantsService');
    }
    
    return tenant;
  }
}



