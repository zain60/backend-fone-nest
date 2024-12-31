import {IsString } from "class-validator";

export class CreateKnowledgeBaseDto {
  
  @IsString()  
  userId: string;

  @IsString()
  
  number: string;

  @IsString()
  type: string;
 
  @IsString()
  voice_Id: string;

  @IsString()
  content: string;

  @IsString()
  first_message: string;
}
