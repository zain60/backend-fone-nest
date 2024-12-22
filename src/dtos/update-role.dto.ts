import { Type } from "class-transformer";
import { IsString, IsOptional, ValidateNested } from "class-validator";
import { Permission } from "./role.dto";

export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    name?: string;
  
    @ValidateNested()
    @Type(() => Permission)
    @IsOptional()
    permissions?: Permission[];

    @IsString()
    @IsOptional()
    roleId?: string;
    
  }
  