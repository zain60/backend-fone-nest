import { IsNotEmpty, isString, IsString } from "class-validator";
export default class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsNotEmpty()
    domain: string;
}



