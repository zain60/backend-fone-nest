import { IsOptional, IsString } from "class-validator";

export class CreateKnowledgeBaseDto {
  
  @IsString()  
  userId: string;

  @IsOptional()
  @IsString()
  inboundSummary: string;

  @IsOptional()
  @IsString()
  outboundSummary: string;

  @IsOptional()
  @IsString()
  inboundMessage: string;

  @IsOptional()
  @IsString()
  outboundMessage: string;
}
