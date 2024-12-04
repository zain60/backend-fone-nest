import { IsNotEmpty, IsString } from "class-validator";
export default class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;
}



