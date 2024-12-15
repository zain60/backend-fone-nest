import { Type } from 'class-transformer';
import {
    ArrayUnique,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Action } from '../libs/utils/enums/action.enum';
import { Resource } from '../libs/utils/enums/resource.enum';

export class CreateRoleDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => Permission)
  permissions: Permission[];
}

export class Permission {
  @IsEnum(Resource)
  resource: Resource;

  @IsEnum(Action, { each: true })
  @ArrayUnique()
  actions: Action[];
}

export { Resource };
