import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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
    const tenantId = request['tenantId'];
    return await this.campaignsService.createCampaign(tenantId,data);
  }

  @Get(':userId')
  async getCampaigns(@Param('userId') userId: string,
   @Query('page') page: number = 1,
    @Query('limit') limit: number = 10) {
      console.log("received")
    return await this.campaignsService.getCampaigns(userId, page, limit);
  }
}
