import { IsNotEmpty, IsString } from "class-validator";

export class CreateListDto {

    @IsString()
    @IsNotEmpty()
    listName: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}
