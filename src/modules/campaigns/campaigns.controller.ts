import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from '../../dtos/createCampagin.dto';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';

@UseGuards(TenantsMiddleware)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { 
  }

  @Post()
  async createCampaign(@Req() request: Request, @Body() data: CreateCampaignDto) {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return await this.campaignsService.createCampaign(tenandId,data);
  }

  @Get(':id')
  async getCampaigns(@Param('id') id: string) {
    return await this.campaignsService.getCampaigns(id);
  }

}
