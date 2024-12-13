import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dtos/createCampagin.dto';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';

@UseGuards(TenantsMiddleware)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { 
  }
  
  @Post()
  async createCampaign(@Body() data: CreateCampaignDto) {
    return await this.campaignsService.createCampaign(data);
  }
}
