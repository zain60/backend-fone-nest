// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { UserTenant } from './schemas/user-tenant.schema';
// import { AuthService } from 'src/auth/auth.service';


// @Injectable()
// export class UserTenantsService {
//   constructor(

//     @InjectModel(UserTenant.name)
//     private tenantModel: Model<UserTenant>,
//     private authService: AuthService,

//   ) { }
//   async getTenantById(tenantId: string) {
//     return await this.tenantModel.findOne({ tenantId });
//   }

//   async getUserByName(username: string) {
//     return await this.tenantModel.findOne({ userName: username });
//   }

//   async createUserTenanat(username: string, tenantId: string) {
//     return await this.tenantModel.create({
//       userName: username,
//       tenantId
//     })
//   }



// }

