import { Controller, Post } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}


    @Post()
    async createCampaign() {
        return await this.campaignsService.createCampaign();
  }
}
