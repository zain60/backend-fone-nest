import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { UserDto } from "src/users/dtos/user.dto";
export default class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @Type(() => UserDto)
    user: UserDto;
}



