import { IsNotEmpty, IsString } from "class-validator";

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    tenant_name: string;


    @IsString()
    @IsNotEmpty()
    tenant_id: string;

    @IsString()
    @IsNotEmpty()
    database_name:string
}
