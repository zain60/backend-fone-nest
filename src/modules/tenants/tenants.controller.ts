import { Body, Controller,Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import CreateCompanyDto from '../../dtos/create-company.dto';
import { UserDto } from 'src/dtos/user.dto';

@Controller('tenant')
export class TenantsController {
  constructor(private readonly tenantService: TenantsService) {}

  @Post('create-company')
  async createCompany(
    @Body() companyData: CreateCompanyDto) {
    return await this.tenantService.createCompany(companyData);
  }
}