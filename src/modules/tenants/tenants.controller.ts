import { Body, Controller,Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import CreateCompanyDto from './dto/create-company.dto';
import { UserDto } from 'src/modules/users/dtos/user.dto';

@Controller('tenant')
export class TenantsController {
  constructor(private readonly tenantService: TenantsService) {}

  @Post('create-company')
  async createCompany(
    @Body() companyData: CreateCompanyDto) {
    return await this.tenantService.createCompany(companyData);
  }
}