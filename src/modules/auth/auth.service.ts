
import { v4 as uuidv4 } from 'uuid';
import { decrypt, encrypt } from 'src/utils/utils.service';
import { ConfigService } from '@nestjs/config';
import { TenantsConnectionService } from '../../shared/services/tenants-connection.service';
import { Secrets, SecretsSchema } from './schemas/secrets.schema';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private tenantConnectionService: TenantsConnectionService,

  ) { }
 
  async createSecretKeyForNewTenant(tenantId: string) {

    const jwtSecret = uuidv4();

    const encryptedSecret = encrypt(
      jwtSecret,
      "encryptionSecretKey",
    );

    const SecretsModel = await this.tenantConnectionService.getTenantModel(
      {
        name: Secrets.name,
        schema: SecretsSchema,
      },
      tenantId,
    );


    await SecretsModel.create({ jwtSecret: encryptedSecret });

  }

  async fetchAccessTokenSecretSigningKey(tenantId: string) {
    const SecretsModel = await this.tenantConnectionService.getTenantModel(
      {
        name: Secrets.name,
        schema: SecretsSchema,
      },
      tenantId,
    );

    const secretsDoc = await SecretsModel.findOne();
    const secretKey = decrypt(
      secretsDoc.jwtSecret,
      "encryptionSecretKey",
    );
    return secretKey;
  }
}

