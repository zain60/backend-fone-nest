import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { CreateKnowledgeBaseDto } from '../../dtos/create-knowledge-base.dto';

@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Post()
  create(@Req() request: Request,@Body() createKnowledgeBaseDto: CreateKnowledgeBaseDto) {
    const tenantId = request['tenantId'];
    return this.knowledgeBaseService.create(tenantId,createKnowledgeBaseDto);
  }

  @Get()
  findAll() {
    return this.knowledgeBaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.knowledgeBaseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id')@Body() data:CreateKnowledgeBaseDto) {
    return this.knowledgeBaseService.update(data );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.knowledgeBaseService.remove(+id);
  }
}
