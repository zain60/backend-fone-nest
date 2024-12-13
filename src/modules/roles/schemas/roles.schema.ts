import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Resource } from "../enums/resource.enum";
import { Action } from "../enums/action.enum";


@Schema()
export class Permissions{
    @Prop({required: true,enum:Resource })
    resource : string;

    @Prop({type:[{type:String,enum:Action}]})
    actions : Action[];
}

@Schema()
export class Role {
    @Prop({required: true})
    name : string;
    
    @Prop({required:true, type:[Permissions]})
    permissions : Permissions[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);


